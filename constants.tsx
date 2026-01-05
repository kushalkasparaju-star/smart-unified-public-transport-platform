
import React from 'react';
import { 
  Bus, 
  Train, 
  Car, 
  Zap, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Leaf, 
  User, 
  Menu,
  ChevronRight,
  ArrowRight,
  CreditCard,
  QrCode,
  LayoutDashboard,
  Users,
  AlertCircle
} from 'lucide-react';
import { TransportMode, RouteOption } from './types';

// Localization: All fares are converted from USD to INR using a fixed rate of 1 USD = ₹83
// This provides a more localized experience for the Indian public transport context.
export const TRANSPORT_MODES: TransportMode[] = [
  { id: 'bus', name: 'Bus', icon: 'Bus', color: 'bg-emerald-100 text-emerald-600' },
  { id: 'metro', name: 'Metro', icon: 'Train', color: 'bg-blue-100 text-blue-600' },
  { id: 'auto', name: 'Auto', icon: 'Navigation', color: 'bg-amber-100 text-amber-600' },
  { id: 'taxi', name: 'Taxi', icon: 'Car', color: 'bg-indigo-100 text-indigo-600' },
];

export const ROUTE_OPTIONS: RouteOption[] = [
  { 
    id: 'r1', 
    modes: ['Bus', 'Metro'], 
    duration: '25 mins', 
    cost: 3735, // ₹3,735 (Equivalent to ~$45)
    ecoScore: 92, 
    label: 'Fastest' 
  },
  { 
    id: 'r2', 
    modes: ['Bus'], 
    duration: '40 mins', 
    cost: 1245, // ₹1,245 (Equivalent to ~$15)
    ecoScore: 85, 
    label: 'Cheapest' 
  },
  { 
    id: 'r3', 
    modes: ['Metro'], 
    duration: '32 mins', 
    cost: 2490, // ₹2,490 (Equivalent to ~$30)
    ecoScore: 98, 
    label: 'Eco-friendly' 
  },
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Bus: <Bus size={24} />,
  Train: <Train size={24} />,
  Car: <Car size={24} />,
  Zap: <Zap size={24} />,
  Navigation: <Navigation size={24} />,
  Clock: <Clock size={20} />,
  ShieldCheck: <ShieldCheck size={24} />,
  Leaf: <Leaf size={24} />,
  User: <User size={24} />,
  Menu: <Menu size={24} />,
  ChevronRight: <ChevronRight size={20} />,
  ArrowRight: <ArrowRight size={20} />,
  CreditCard: <CreditCard size={24} />,
  QrCode: <QrCode size={32} />,
  LayoutDashboard: <LayoutDashboard size={24} />,
  Users: <Users size={24} />,
  AlertCircle: <AlertCircle size={24} />,
};
