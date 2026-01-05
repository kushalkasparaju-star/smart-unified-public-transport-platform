// Authentication service with Firebase support and mock fallback

export interface User {
  uid: string;
  email: string;
  username?: string;
}

// Mock storage for fallback auth
const MOCK_USERS_STORAGE_KEY = 'mock_users_storage';
const mockUsers: Map<string, { email: string; password: string; username?: string }> = new Map();
const mockSessions: Map<string, User> = new Map();

// Load mock users from localStorage on initialization
const loadMockUsers = (): void => {
  try {
    const stored = localStorage.getItem(MOCK_USERS_STORAGE_KEY);
    if (stored) {
      const users = JSON.parse(stored);
      Object.entries(users).forEach(([email, userData]: [string, any]) => {
        mockUsers.set(email, userData);
      });
    }
  } catch {
    // Ignore parse errors
  }
};

// Save mock users to localStorage
const saveMockUsers = (): void => {
  try {
    const users: Record<string, { email: string; password: string; username?: string }> = {};
    mockUsers.forEach((userData, email) => {
      users[email] = userData;
    });
    localStorage.setItem(MOCK_USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage errors
  }
};

// Initialize mock users on load
if (typeof window !== 'undefined') {
  loadMockUsers();
}

// Check if Firebase is available and initialized
const isFirebaseAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    const firebase = (window as any).firebase;
    if (!firebase || !firebase.auth) return false;
    
    // Check if Firebase app is initialized
    // Firebase throws error if app is not initialized when accessing auth()
    try {
      // Check if apps array exists and has initialized apps
      if (firebase.apps && firebase.apps.length > 0) {
        return true;
      }
      // If apps array is empty or doesn't exist, Firebase is not initialized
      // Don't try to access auth() here as it will throw
      return false;
    } catch {
      // Firebase SDK loaded but not initialized
      return false;
    }
  } catch {
    return false;
  }
};

// Get Firebase auth instance safely
const getFirebaseAuth = () => {
  if (!isFirebaseAvailable()) return null;
  try {
    const firebase = (window as any).firebase;
    // Double-check initialization before accessing auth
    const apps = firebase.apps;
    if (apps && apps.length === 0) {
      return null; // Firebase not initialized
    }
    return firebase.auth();
  } catch (error) {
    // Firebase not initialized or error accessing auth
    console.warn('Firebase auth not available, using mock authentication');
    return null;
  }
};

export const authService = {
  // Sign up with email and password
  async signUp(username: string, email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const auth = getFirebaseAuth();
      
      if (auth) {
        // Use Firebase
        try {
          const userCredential = await auth.createUserWithEmailAndPassword(email, password);
          const user = userCredential.user;
          
          // Update profile with username if possible
          if (user && user.updateProfile) {
            try {
              await user.updateProfile({ displayName: username });
            } catch (profileError) {
              // Profile update failed, but account creation succeeded
              console.warn('Failed to update profile:', profileError);
            }
          }
          
          return {
            success: true,
            user: {
              uid: user.uid,
              email: user.email || email,
              username
            }
          };
        } catch (firebaseError: any) {
          // Handle Firebase-specific errors
          // If error is about Firebase not being initialized, fall through to mock auth
          if (firebaseError.message && firebaseError.message.includes('No Firebase App')) {
            // Fall through to mock auth below
          } else {
            // Handle other Firebase-specific errors
            let errorMessage = 'Failed to create account';
            if (firebaseError.code === 'auth/email-already-in-use') {
              errorMessage = 'Email already registered';
            } else if (firebaseError.code === 'auth/invalid-email') {
              errorMessage = 'Invalid email address';
            } else if (firebaseError.code === 'auth/weak-password') {
              errorMessage = 'Password is too weak';
            } else if (firebaseError.message) {
              errorMessage = firebaseError.message;
            }
            return { success: false, error: errorMessage };
          }
        }
      }
      
      // Fallback to mock auth (either Firebase not available or initialization error)
      // Check for duplicate email
      if (mockUsers.has(email.toLowerCase())) {
        return { success: false, error: 'Email already registered' };
      }
      
      // Check for duplicate username (optional, but good practice)
      for (const userData of mockUsers.values()) {
        if (userData.username?.toLowerCase() === username.toLowerCase()) {
          return { success: false, error: 'Username already taken' };
        }
      }
      
      const uid = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const normalizedEmail = email.toLowerCase();
      mockUsers.set(normalizedEmail, { email: normalizedEmail, password, username });
      saveMockUsers(); // Persist to localStorage
      
      const user: User = { uid, email: normalizedEmail, username };
      mockSessions.set(uid, user);
      localStorage.setItem('auth_user', JSON.stringify(user));
      
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to create account' 
      };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const auth = getFirebaseAuth();
      
      if (auth) {
        // Use Firebase
        try {
          const userCredential = await auth.signInWithEmailAndPassword(email, password);
          const user = userCredential.user;
          
          return {
            success: true,
            user: {
              uid: user.uid,
              email: user.email || email,
              username: user.displayName || undefined
            }
          };
        } catch (firebaseError: any) {
          // If Firebase not initialized, fall through to mock auth
          if (firebaseError.message && firebaseError.message.includes('No Firebase App')) {
            // Fall through to mock auth below
          } else {
            // Handle other Firebase errors
            let errorMessage = 'Failed to sign in';
            if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
              errorMessage = 'Invalid email or password';
            } else if (firebaseError.message) {
              errorMessage = firebaseError.message;
            }
            return { success: false, error: errorMessage };
          }
        }
      }
      
      // Fallback to mock auth
      const normalizedEmail = email.toLowerCase();
      const stored = mockUsers.get(normalizedEmail);
      if (!stored || stored.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }
      
      // Find or create user session
      let user: User | undefined;
      for (const [uid, u] of mockSessions.entries()) {
        if (u.email.toLowerCase() === normalizedEmail) {
          user = u;
          break;
        }
      }
      
      if (!user) {
        const uid = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        user = { uid, email: normalizedEmail, username: stored.username };
        mockSessions.set(uid, user);
      }
      
      localStorage.setItem('auth_user', JSON.stringify(user));
      return { success: true, user };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Failed to sign in' 
      };
    }
  },

  // Sign out
  async signOut(): Promise<void> {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        await auth.signOut();
      }
      localStorage.removeItem('auth_user');
      mockSessions.clear();
    } catch (error) {
      console.error('Sign out error:', error);
      localStorage.removeItem('auth_user');
      mockSessions.clear();
    }
  },

  // Get current user
  getCurrentUser(): User | null {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        try {
          const user = auth.currentUser;
          if (user) {
            return {
              uid: user.uid,
              email: user.email || '',
              username: user.displayName || undefined
            };
          }
        } catch (error) {
          // Firebase not initialized, fall through to localStorage
        }
      }
      
      // Fallback: check localStorage
      const stored = localStorage.getItem('auth_user');
      if (stored) {
        return JSON.parse(stored);
      }
      
      return null;
    } catch {
      return null;
    }
  },

  // Check auth state (for Firebase)
  onAuthStateChanged(callback: (user: User | null) => void): (() => void) | null {
    try {
      const auth = getFirebaseAuth();
      if (auth) {
        try {
          return auth.onAuthStateChanged((firebaseUser: any) => {
            if (firebaseUser) {
              callback({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                username: firebaseUser.displayName || undefined
              });
            } else {
              callback(null);
            }
          });
        } catch (error) {
          // Firebase not initialized, return null (no-op unsubscribe)
          return null;
        }
      }
    } catch {
      // Fallback: no-op unsubscribe
    }
    return null;
  }
};

