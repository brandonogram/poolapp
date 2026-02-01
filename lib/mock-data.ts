// Mock data for Pool App dashboard

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  color: string;
  phone: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  serviceDay: string;
  assignedTechId: string;
  rate: number;
  poolType: 'inground' | 'above-ground' | 'infinity' | 'lap';
  poolVolume: number;
  sanitizer: 'chlorine' | 'salt' | 'bromine' | 'mineral';
  lastServiceDate: string;
  nextServiceDate: string;
  status: 'active' | 'paused' | 'overdue';
  notes: string;
  lat: number;
  lng: number;
}

export interface ServiceLog {
  id: string;
  customerId: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  chemistry: {
    chlorine: number;
    ph: number;
    alkalinity: number;
    cyanuricAcid: number;
    calcium: number;
  };
  tasks: string[];
  notes: string;
  photos: string[];
}

export interface RouteStop {
  id: string;
  order: number;
  customerId: string;
  customerName: string;
  address: string;
  estimatedArrival: string;
  estimatedDuration: number;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
  lat: number;
  lng: number;
}

export interface TechnicianRoute {
  id: string;
  technicianId: string;
  date: string;
  stops: RouteStop[];
  totalDistance: number;
  estimatedTime: number;
  optimizedDistance: number;
  optimizedTime: number;
}

export interface Alert {
  id: string;
  type: 'chemistry' | 'equipment' | 'overdue' | 'weather';
  severity: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  customerId?: string;
  timestamp: string;
}

// Technicians - Delaware Pool Pros team
export const technicians: Technician[] = [
  {
    id: 'tech-1',
    name: 'Mike Rodriguez',
    avatar: '/avatars/mike.jpg',
    color: '#3B82F6',
    phone: '(302) 555-0101',
  },
  {
    id: 'tech-2',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    color: '#10B981',
    phone: '(302) 555-0102',
  },
  {
    id: 'tech-3',
    name: 'Jake Thompson',
    avatar: '/avatars/jake.jpg',
    color: '#F59E0B',
    phone: '(302) 555-0103',
  },
];

// Customers - Delaware Pool Pros customer base
// Realistic Delaware cities and pool sizes
export const customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Johnson Family',
    address: '1842 Baynard Blvd',
    city: 'Wilmington, DE 19802',
    phone: '(302) 555-1234',
    email: 'johnson@email.com',
    serviceDay: 'Monday',
    assignedTechId: 'tech-1',
    rate: 165,
    poolType: 'inground',
    poolVolume: 18000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    status: 'active',
    notes: 'Gate code: 4521. Salt system. Dog is friendly.',
    lat: 39.7596,
    lng: -75.5462,
  },
  {
    id: 'cust-2',
    name: 'Chen Residence',
    address: '245 Rockwood Rd',
    city: 'Wilmington, DE 19802',
    phone: '(302) 555-2345',
    email: 'chen@email.com',
    serviceDay: 'Monday',
    assignedTechId: 'tech-1',
    rate: 195,
    poolType: 'inground',
    poolVolume: 22000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    status: 'active',
    notes: 'Pool with attached spa. Key under mat by back door.',
    lat: 39.7612,
    lng: -75.5523,
  },
  {
    id: 'cust-3',
    name: 'Williams Estate',
    address: '589 Kennett Pike',
    city: 'Greenville, DE 19807',
    phone: '(302) 555-3456',
    email: 'williams@email.com',
    serviceDay: 'Monday',
    assignedTechId: 'tech-1',
    rate: 275,
    poolType: 'infinity',
    poolVolume: 28000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    status: 'active',
    notes: 'Premium infinity pool. Filter replacement due. Check overflow.',
    lat: 39.8012,
    lng: -75.5876,
  },
  {
    id: 'cust-4',
    name: 'Thompson Home',
    address: '1120 Paper Mill Rd',
    city: 'Newark, DE 19711',
    phone: '(302) 555-4567',
    email: 'thompson@email.com',
    serviceDay: 'Tuesday',
    assignedTechId: 'tech-2',
    rate: 155,
    poolType: 'above-ground',
    poolVolume: 15000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-21',
    nextServiceDate: '2026-01-28',
    status: 'active',
    notes: 'Winter cover on. Opening season prep scheduled.',
    lat: 39.6837,
    lng: -75.7497,
  },
  {
    id: 'cust-5',
    name: 'Rehoboth Beach Club',
    address: '1 Virginia Ave',
    city: 'Rehoboth Beach, DE 19971',
    phone: '(302) 555-5678',
    email: 'manager@rehobothclub.com',
    serviceDay: 'Tuesday',
    assignedTechId: 'tech-2',
    rate: 450,
    poolType: 'inground',
    poolVolume: 65000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-21',
    nextServiceDate: '2026-01-28',
    status: 'active',
    notes: 'Commercial pool. Health dept inspections monthly. Premium account.',
    lat: 38.7209,
    lng: -75.0760,
  },
  {
    id: 'cust-6',
    name: 'Anderson Pool',
    address: '2234 Silverside Rd',
    city: 'Wilmington, DE 19810',
    phone: '(302) 555-7890',
    email: 'anderson@email.com',
    serviceDay: 'Wednesday',
    assignedTechId: 'tech-3',
    rate: 185,
    poolType: 'lap',
    poolVolume: 24000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-22',
    nextServiceDate: '2026-01-29',
    status: 'active',
    notes: 'Lap pool. Heater serviced Dec 2025. Very particular about chemistry.',
    lat: 39.8087,
    lng: -75.5168,
  },
  {
    id: 'cust-7',
    name: 'Davis Residence',
    address: '456 Limestone Rd',
    city: 'Wilmington, DE 19804',
    phone: '(302) 555-8901',
    email: 'davis@email.com',
    serviceDay: 'Wednesday',
    assignedTechId: 'tech-3',
    rate: 145,
    poolType: 'inground',
    poolVolume: 16000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-22',
    nextServiceDate: '2026-01-29',
    status: 'active',
    notes: 'Gate code: 7788. Standard residential pool.',
    lat: 39.7456,
    lng: -75.6234,
  },
  {
    id: 'cust-8',
    name: 'Wilson Family',
    address: '3421 Concord Pike',
    city: 'Wilmington, DE 19803',
    phone: '(302) 555-9012',
    email: 'wilson@email.com',
    serviceDay: 'Thursday',
    assignedTechId: 'tech-1',
    rate: 195,
    poolType: 'inground',
    poolVolume: 25000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-23',
    nextServiceDate: '2026-01-30',
    status: 'active',
    notes: 'Waterfall feature. Premium salt system.',
    lat: 39.7967,
    lng: -75.5545,
  },
  {
    id: 'cust-9',
    name: 'Harbor View HOA',
    address: '100 Harbor Dr',
    city: 'Lewes, DE 19958',
    phone: '(302) 555-0123',
    email: 'hoa@harborview.com',
    serviceDay: 'Thursday',
    assignedTechId: 'tech-2',
    rate: 550,
    poolType: 'inground',
    poolVolume: 55000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-23',
    nextServiceDate: '2026-01-30',
    status: 'active',
    notes: 'Community pool. Filter replacement scheduled this week.',
    lat: 38.7745,
    lng: -75.1393,
  },
  {
    id: 'cust-10',
    name: 'Dover Country Club',
    address: '800 Country Club Rd',
    city: 'Dover, DE 19901',
    phone: '(302) 555-4455',
    email: 'facilities@dovercc.com',
    serviceDay: 'Friday',
    assignedTechId: 'tech-3',
    rate: 550,
    poolType: 'inground',
    poolVolume: 70000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-24',
    nextServiceDate: '2026-01-31',
    status: 'active',
    notes: 'VIP commercial account. Premium service level.',
    lat: 39.1582,
    lng: -75.5244,
  },
];

// Today's routes - Delaware Pool Pros
export const todayRoutes: TechnicianRoute[] = [
  {
    id: 'route-1',
    technicianId: 'tech-1',
    date: '2026-01-26',
    stops: [
      {
        id: 'stop-1',
        order: 1,
        customerId: 'cust-1',
        customerName: 'Johnson Family',
        address: '1842 Baynard Blvd, Wilmington',
        estimatedArrival: '8:00 AM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 39.7596,
        lng: -75.5462,
      },
      {
        id: 'stop-2',
        order: 2,
        customerId: 'cust-2',
        customerName: 'Chen Residence',
        address: '245 Rockwood Rd, Wilmington',
        estimatedArrival: '9:00 AM',
        estimatedDuration: 50,
        status: 'completed',
        lat: 39.7612,
        lng: -75.5523,
      },
      {
        id: 'stop-3',
        order: 3,
        customerId: 'cust-3',
        customerName: 'Williams Estate',
        address: '589 Kennett Pike, Greenville',
        estimatedArrival: '10:15 AM',
        estimatedDuration: 60,
        status: 'completed',
        lat: 39.8012,
        lng: -75.5876,
      },
      {
        id: 'stop-4',
        order: 4,
        customerId: 'cust-8',
        customerName: 'Wilson Family',
        address: '3421 Concord Pike, Wilmington',
        estimatedArrival: '11:30 AM',
        estimatedDuration: 50,
        status: 'completed',
        lat: 39.7967,
        lng: -75.5545,
      },
      {
        id: 'stop-5',
        order: 5,
        customerId: 'cust-7',
        customerName: 'Davis Residence',
        address: '456 Limestone Rd, Wilmington',
        estimatedArrival: '12:45 PM',
        estimatedDuration: 40,
        status: 'in-progress',
        lat: 39.7456,
        lng: -75.6234,
      },
      {
        id: 'stop-6',
        order: 6,
        customerId: 'cust-10',
        customerName: 'Dover Country Club',
        address: '800 Country Club Rd, Dover',
        estimatedArrival: '2:30 PM',
        estimatedDuration: 75,
        status: 'pending',
        lat: 39.1582,
        lng: -75.5244,
      },
    ],
    totalDistance: 72.5,
    estimatedTime: 480,
    optimizedDistance: 54.3,
    optimizedTime: 395,
  },
  {
    id: 'route-2',
    technicianId: 'tech-2',
    date: '2026-01-26',
    stops: [
      {
        id: 'stop-11',
        order: 1,
        customerId: 'cust-4',
        customerName: 'Thompson Home',
        address: '1120 Paper Mill Rd, Newark',
        estimatedArrival: '8:00 AM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 39.6837,
        lng: -75.7497,
      },
      {
        id: 'stop-12',
        order: 2,
        customerId: 'cust-9',
        customerName: 'Harbor View HOA',
        address: '100 Harbor Dr, Lewes',
        estimatedArrival: '9:30 AM',
        estimatedDuration: 75,
        status: 'completed',
        lat: 38.7745,
        lng: -75.1393,
      },
      {
        id: 'stop-13',
        order: 3,
        customerId: 'cust-5',
        customerName: 'Rehoboth Beach Club',
        address: '1 Virginia Ave, Rehoboth Beach',
        estimatedArrival: '11:15 AM',
        estimatedDuration: 90,
        status: 'in-progress',
        lat: 38.7209,
        lng: -75.0760,
      },
    ],
    totalDistance: 85.2,
    estimatedTime: 320,
    optimizedDistance: 68.5,
    optimizedTime: 275,
  },
  {
    id: 'route-3',
    technicianId: 'tech-3',
    date: '2026-01-26',
    stops: [
      {
        id: 'stop-19',
        order: 1,
        customerId: 'cust-6',
        customerName: 'Anderson Pool',
        address: '2234 Silverside Rd, Wilmington',
        estimatedArrival: '8:00 AM',
        estimatedDuration: 55,
        status: 'completed',
        lat: 39.8087,
        lng: -75.5168,
      },
      {
        id: 'stop-20',
        order: 2,
        customerId: 'cust-7',
        customerName: 'Davis Residence',
        address: '456 Limestone Rd, Wilmington',
        estimatedArrival: '9:15 AM',
        estimatedDuration: 40,
        status: 'completed',
        lat: 39.7456,
        lng: -75.6234,
      },
      {
        id: 'stop-21',
        order: 3,
        customerId: 'cust-8',
        customerName: 'Wilson Family',
        address: '3421 Concord Pike, Wilmington',
        estimatedArrival: '10:15 AM',
        estimatedDuration: 50,
        status: 'completed',
        lat: 39.7967,
        lng: -75.5545,
      },
      {
        id: 'stop-22',
        order: 4,
        customerId: 'cust-10',
        customerName: 'Dover Country Club',
        address: '800 Country Club Rd, Dover',
        estimatedArrival: '12:00 PM',
        estimatedDuration: 75,
        status: 'pending',
        lat: 39.1582,
        lng: -75.5244,
      },
    ],
    totalDistance: 62.7,
    estimatedTime: 340,
    optimizedDistance: 48.2,
    optimizedTime: 285,
  },
];

// Alerts - Demonstrate value: catching problems before they become expensive
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'chemistry',
    severity: 'high',
    title: 'pH high at Johnson - prevented $500 callback',
    message: 'Auto-detected pH 8.2 before customer noticed cloudy water. Scheduled acid treatment.',
    customerId: 'cust-1',
    timestamp: '2026-01-26T09:30:00',
  },
  {
    id: 'alert-2',
    type: 'equipment',
    severity: 'medium',
    title: 'Filter replacement due at 3 pools this week',
    message: 'Williams Estate, Chen Residence, Harbor View HOA - proactively scheduled',
    customerId: 'cust-3',
    timestamp: '2026-01-26T08:15:00',
  },
  {
    id: 'alert-3',
    type: 'overdue',
    severity: 'medium',
    title: 'Jake running 30min behind - route auto-adjusted',
    message: 'Traffic on Rt. 1 near Rehoboth - 3 customers notified automatically',
    timestamp: '2026-01-26T10:45:00',
  },
  {
    id: 'alert-4',
    type: 'weather',
    severity: 'low',
    title: 'Opening season prep reminder',
    message: '12 pools scheduled for spring inspections. Equipment checks queued.',
    timestamp: '2026-01-26T07:00:00',
  },
];

// Service history - Shows the VALUE STORY for Johnson Family
// Problem detected early -> Action taken -> Problem resolved -> Money saved
export const serviceHistory: ServiceLog[] = [
  {
    id: 'log-1',
    customerId: 'cust-1',
    technicianId: 'tech-1',
    date: '2026-01-24',
    startTime: '8:15 AM',
    endTime: '9:00 AM',
    chemistry: {
      chlorine: 2.8,
      ph: 7.4,
      alkalinity: 95,
      cyanuricAcid: 45,
      calcium: 280,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Check filter', 'Test chemistry', 'Verify acid treatment'],
    notes: 'SUCCESS: pH now balanced at 7.4 after last weeks treatment. Pool crystal clear. Customer mentioned they avoided a $500 callback - their old company missed a pH problem that turned the pool cloudy.',
    photos: [],
  },
  {
    id: 'log-2',
    customerId: 'cust-1',
    technicianId: 'tech-1',
    date: '2026-01-17',
    startTime: '8:30 AM',
    endTime: '9:20 AM',
    chemistry: {
      chlorine: 2.2,
      ph: 8.1,
      alkalinity: 100,
      cyanuricAcid: 42,
      calcium: 275,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Backwash filter', 'Test chemistry', 'Add acid treatment'],
    notes: 'ALERT CAUGHT: pH trending high at 8.1 - detected BEFORE water turned cloudy. Added 1.5 qt muriatic acid. This is exactly the kind of early detection that prevents expensive callbacks. Scheduled follow-up verification.',
    photos: [],
  },
  {
    id: 'log-3',
    customerId: 'cust-1',
    technicianId: 'tech-1',
    date: '2026-01-10',
    startTime: '8:00 AM',
    endTime: '8:45 AM',
    chemistry: {
      chlorine: 3.0,
      ph: 7.5,
      alkalinity: 90,
      cyanuricAcid: 40,
      calcium: 270,
    },
    tasks: ['Skim surface', 'Brush walls', 'Test chemistry', 'Inspect salt cell'],
    notes: 'Pool in excellent condition. Salt cell producing well. Noted pH starting to creep - will watch closely next visit. Proactive monitoring in action.',
    photos: [],
  },
  {
    id: 'log-4',
    customerId: 'cust-1',
    technicianId: 'tech-1',
    date: '2026-01-03',
    startTime: '8:15 AM',
    endTime: '9:05 AM',
    chemistry: {
      chlorine: 2.5,
      ph: 7.6,
      alkalinity: 88,
      cyanuricAcid: 38,
      calcium: 265,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Test chemistry', 'Add stabilizer'],
    notes: 'Opening season prep visit. CYA slightly low, added stabilizer. Pool winterized well - minimal debris. Setting good chemistry baseline for the season.',
    photos: [],
  },
];

// Weekly stats - matches convention pitch numbers
export const weeklyStats = {
  revenue: 11962, // On track for $47,850/month
  revenueChange: 12.5,
  poolsDone: 52,
  poolsTotal: 58,
  timeSaved: 4.8, // Hours saved from route optimization
  fuelSaved: 82, // Gallons saved this week
  avgServiceTime: 38, // Minutes per pool (efficient)
  customerSatisfaction: 4.9, // Matches our pitch
  routeSavings: 350, // Weekly route savings ($4,200/year)
  preventedCallbacks: 3, // Callbacks prevented by chemistry alerts
};

// Schedule data for the week
export const weeklySchedule = {
  week: '2026-01-20',
  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  technicians: [
    {
      id: 'tech-1',
      name: 'Mike Rodriguez',
      pools: [12, 10, 8, 11, 9],
    },
    {
      id: 'tech-2',
      name: 'Sarah Chen',
      pools: [10, 11, 9, 10, 8],
    },
    {
      id: 'tech-3',
      name: 'Jake Thompson',
      pools: [8, 9, 10, 8, 7],
    },
  ],
  unscheduled: [2, 1, 3, 2, 4],
};

// Helper functions
export function getTechnicianById(id: string): Technician | undefined {
  return technicians.find((t) => t.id === id);
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function getCustomersByTechnician(techId: string): Customer[] {
  return customers.filter((c) => c.assignedTechId === techId);
}

export function getRouteByTechnician(techId: string): TechnicianRoute | undefined {
  return todayRoutes.find((r) => r.technicianId === techId);
}

export function getServiceHistoryByCustomer(customerId: string): ServiceLog[] {
  return serviceHistory.filter((s) => s.customerId === customerId);
}
