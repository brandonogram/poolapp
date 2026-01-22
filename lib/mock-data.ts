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

// Technicians
export const technicians: Technician[] = [
  {
    id: 'tech-1',
    name: 'Mike Rodriguez',
    avatar: '/avatars/mike.jpg',
    color: '#3B82F6',
    phone: '(555) 123-4567',
  },
  {
    id: 'tech-2',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    color: '#10B981',
    phone: '(555) 234-5678',
  },
  {
    id: 'tech-3',
    name: 'Jake Thompson',
    avatar: '/avatars/jake.jpg',
    color: '#F59E0B',
    phone: '(555) 345-6789',
  },
];

// Customers
export const customers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Johnson Family',
    address: '1234 Oak Lane',
    city: 'Phoenix, AZ 85001',
    phone: '(555) 111-2222',
    email: 'johnson@email.com',
    serviceDay: 'Monday',
    assignedTechId: 'tech-1',
    rate: 165,
    poolType: 'inground',
    poolVolume: 18000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-20',
    nextServiceDate: '2026-01-27',
    status: 'active',
    notes: 'Gate code: 1234. Dog is friendly.',
    lat: 33.4484,
    lng: -112.0740,
  },
  {
    id: 'cust-2',
    name: 'Martinez Residence',
    address: '567 Palm Drive',
    city: 'Phoenix, AZ 85003',
    phone: '(555) 222-3333',
    email: 'martinez@email.com',
    serviceDay: 'Monday',
    assignedTechId: 'tech-1',
    rate: 145,
    poolType: 'inground',
    poolVolume: 15000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-20',
    nextServiceDate: '2026-01-27',
    status: 'active',
    notes: 'Equipment shed behind garage.',
    lat: 33.4516,
    lng: -112.0785,
  },
  {
    id: 'cust-3',
    name: 'Williams Estate',
    address: '890 Sunset Blvd',
    city: 'Scottsdale, AZ 85251',
    phone: '(555) 333-4444',
    email: 'williams@email.com',
    serviceDay: 'Monday',
    assignedTechId: 'tech-1',
    rate: 225,
    poolType: 'infinity',
    poolVolume: 25000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-20',
    nextServiceDate: '2026-01-27',
    status: 'active',
    notes: 'Large infinity pool. Check overflow channel.',
    lat: 33.4942,
    lng: -111.9261,
  },
  {
    id: 'cust-4',
    name: 'Thompson Home',
    address: '2345 Cactus Way',
    city: 'Phoenix, AZ 85004',
    phone: '(555) 444-5555',
    email: 'thompson@email.com',
    serviceDay: 'Tuesday',
    assignedTechId: 'tech-2',
    rate: 155,
    poolType: 'inground',
    poolVolume: 16000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-21',
    nextServiceDate: '2026-01-28',
    status: 'active',
    notes: 'Key under mat.',
    lat: 33.4556,
    lng: -112.0654,
  },
  {
    id: 'cust-5',
    name: 'Garcia Family',
    address: '678 Desert Rose',
    city: 'Tempe, AZ 85281',
    phone: '(555) 555-6666',
    email: 'garcia@email.com',
    serviceDay: 'Tuesday',
    assignedTechId: 'tech-2',
    rate: 135,
    poolType: 'above-ground',
    poolVolume: 8000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-21',
    nextServiceDate: '2026-01-28',
    status: 'active',
    notes: '',
    lat: 33.4255,
    lng: -111.9400,
  },
  {
    id: 'cust-6',
    name: 'Anderson Pool',
    address: '1111 Mountain View',
    city: 'Mesa, AZ 85201',
    phone: '(555) 666-7777',
    email: 'anderson@email.com',
    serviceDay: 'Wednesday',
    assignedTechId: 'tech-3',
    rate: 175,
    poolType: 'lap',
    poolVolume: 22000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-15',
    nextServiceDate: '2026-01-22',
    status: 'overdue',
    notes: 'Competition lap pool. Very particular about chemistry.',
    lat: 33.4152,
    lng: -111.8315,
  },
  {
    id: 'cust-7',
    name: 'Davis Residence',
    address: '3456 Valley Lane',
    city: 'Phoenix, AZ 85006',
    phone: '(555) 777-8888',
    email: 'davis@email.com',
    serviceDay: 'Wednesday',
    assignedTechId: 'tech-3',
    rate: 145,
    poolType: 'inground',
    poolVolume: 14000,
    sanitizer: 'mineral',
    lastServiceDate: '2026-01-22',
    nextServiceDate: '2026-01-29',
    status: 'active',
    notes: 'Mineral system - check cartridge monthly.',
    lat: 33.4620,
    lng: -112.0515,
  },
  {
    id: 'cust-8',
    name: 'Wilson Family',
    address: '789 Hillside Dr',
    city: 'Scottsdale, AZ 85254',
    phone: '(555) 888-9999',
    email: 'wilson@email.com',
    serviceDay: 'Thursday',
    assignedTechId: 'tech-1',
    rate: 195,
    poolType: 'inground',
    poolVolume: 20000,
    sanitizer: 'salt',
    lastServiceDate: '2026-01-16',
    nextServiceDate: '2026-01-23',
    status: 'active',
    notes: 'Has spa attached. Check spa chemistry too.',
    lat: 33.5722,
    lng: -111.9260,
  },
  {
    id: 'cust-9',
    name: 'Brown Pool House',
    address: '4567 Oasis Ct',
    city: 'Gilbert, AZ 85296',
    phone: '(555) 999-0000',
    email: 'brown@email.com',
    serviceDay: 'Thursday',
    assignedTechId: 'tech-2',
    rate: 165,
    poolType: 'inground',
    poolVolume: 17000,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-16',
    nextServiceDate: '2026-01-23',
    status: 'active',
    notes: 'Pool house has separate filter system.',
    lat: 33.3528,
    lng: -111.7890,
  },
  {
    id: 'cust-10',
    name: 'Miller Residence',
    address: '8901 Sunset Hills',
    city: 'Phoenix, AZ 85008',
    phone: '(555) 000-1111',
    email: 'miller@email.com',
    serviceDay: 'Friday',
    assignedTechId: 'tech-3',
    rate: 155,
    poolType: 'inground',
    poolVolume: 16500,
    sanitizer: 'chlorine',
    lastServiceDate: '2026-01-17',
    nextServiceDate: '2026-01-24',
    status: 'active',
    notes: '',
    lat: 33.4589,
    lng: -112.0234,
  },
];

// Today's routes
export const todayRoutes: TechnicianRoute[] = [
  {
    id: 'route-1',
    technicianId: 'tech-1',
    date: '2026-01-22',
    stops: [
      {
        id: 'stop-1',
        order: 1,
        customerId: 'cust-1',
        customerName: 'Johnson Family',
        address: '1234 Oak Lane',
        estimatedArrival: '8:00 AM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 33.4484,
        lng: -112.0740,
      },
      {
        id: 'stop-2',
        order: 2,
        customerId: 'cust-2',
        customerName: 'Martinez Residence',
        address: '567 Palm Drive',
        estimatedArrival: '9:00 AM',
        estimatedDuration: 40,
        status: 'completed',
        lat: 33.4516,
        lng: -112.0785,
      },
      {
        id: 'stop-3',
        order: 3,
        customerId: 'cust-3',
        customerName: 'Williams Estate',
        address: '890 Sunset Blvd',
        estimatedArrival: '10:00 AM',
        estimatedDuration: 60,
        status: 'completed',
        lat: 33.4942,
        lng: -111.9261,
      },
      {
        id: 'stop-4',
        order: 4,
        customerId: 'cust-8',
        customerName: 'Wilson Family',
        address: '789 Hillside Dr',
        estimatedArrival: '11:15 AM',
        estimatedDuration: 50,
        status: 'completed',
        lat: 33.5722,
        lng: -111.9260,
      },
      {
        id: 'stop-5',
        order: 5,
        customerId: 'cust-4',
        customerName: 'Thompson Home',
        address: '2345 Cactus Way',
        estimatedArrival: '12:30 PM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 33.4556,
        lng: -112.0654,
      },
      {
        id: 'stop-6',
        order: 6,
        customerId: 'cust-5',
        customerName: 'Garcia Family',
        address: '678 Desert Rose',
        estimatedArrival: '1:30 PM',
        estimatedDuration: 35,
        status: 'completed',
        lat: 33.4255,
        lng: -111.9400,
      },
      {
        id: 'stop-7',
        order: 7,
        customerId: 'cust-6',
        customerName: 'Anderson Pool',
        address: '1111 Mountain View',
        estimatedArrival: '2:30 PM',
        estimatedDuration: 55,
        status: 'completed',
        lat: 33.4152,
        lng: -111.8315,
      },
      {
        id: 'stop-8',
        order: 8,
        customerId: 'cust-7',
        customerName: 'Davis Residence',
        address: '3456 Valley Lane',
        estimatedArrival: '3:45 PM',
        estimatedDuration: 40,
        status: 'in-progress',
        lat: 33.4620,
        lng: -112.0515,
      },
      {
        id: 'stop-9',
        order: 9,
        customerId: 'cust-9',
        customerName: 'Brown Pool House',
        address: '4567 Oasis Ct',
        estimatedArrival: '4:45 PM',
        estimatedDuration: 45,
        status: 'pending',
        lat: 33.3528,
        lng: -111.7890,
      },
      {
        id: 'stop-10',
        order: 10,
        customerId: 'cust-10',
        customerName: 'Miller Residence',
        address: '8901 Sunset Hills',
        estimatedArrival: '5:45 PM',
        estimatedDuration: 40,
        status: 'pending',
        lat: 33.4589,
        lng: -112.0234,
      },
    ],
    totalDistance: 68.5,
    estimatedTime: 520,
    optimizedDistance: 52.3,
    optimizedTime: 445,
  },
  {
    id: 'route-2',
    technicianId: 'tech-2',
    date: '2026-01-22',
    stops: [
      {
        id: 'stop-11',
        order: 1,
        customerId: 'cust-4',
        customerName: 'Thompson Home',
        address: '2345 Cactus Way',
        estimatedArrival: '8:00 AM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 33.4556,
        lng: -112.0654,
      },
      {
        id: 'stop-12',
        order: 2,
        customerId: 'cust-5',
        customerName: 'Garcia Family',
        address: '678 Desert Rose',
        estimatedArrival: '9:00 AM',
        estimatedDuration: 35,
        status: 'completed',
        lat: 33.4255,
        lng: -111.9400,
      },
      {
        id: 'stop-13',
        order: 3,
        customerId: 'cust-9',
        customerName: 'Brown Pool House',
        address: '4567 Oasis Ct',
        estimatedArrival: '10:00 AM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 33.3528,
        lng: -111.7890,
      },
      {
        id: 'stop-14',
        order: 4,
        customerId: 'cust-1',
        customerName: 'Johnson Family',
        address: '1234 Oak Lane',
        estimatedArrival: '11:15 AM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 33.4484,
        lng: -112.0740,
      },
      {
        id: 'stop-15',
        order: 5,
        customerId: 'cust-2',
        customerName: 'Martinez Residence',
        address: '567 Palm Drive',
        estimatedArrival: '12:15 PM',
        estimatedDuration: 40,
        status: 'completed',
        lat: 33.4516,
        lng: -112.0785,
      },
      {
        id: 'stop-16',
        order: 6,
        customerId: 'cust-7',
        customerName: 'Davis Residence',
        address: '3456 Valley Lane',
        estimatedArrival: '1:15 PM',
        estimatedDuration: 40,
        status: 'completed',
        lat: 33.4620,
        lng: -112.0515,
      },
      {
        id: 'stop-17',
        order: 7,
        customerId: 'cust-10',
        customerName: 'Miller Residence',
        address: '8901 Sunset Hills',
        estimatedArrival: '2:15 PM',
        estimatedDuration: 40,
        status: 'completed',
        lat: 33.4589,
        lng: -112.0234,
      },
      {
        id: 'stop-18',
        order: 8,
        customerId: 'cust-3',
        customerName: 'Williams Estate',
        address: '890 Sunset Blvd',
        estimatedArrival: '3:15 PM',
        estimatedDuration: 60,
        status: 'in-progress',
        lat: 33.4942,
        lng: -111.9261,
      },
    ],
    totalDistance: 54.2,
    estimatedTime: 410,
    optimizedDistance: 42.8,
    optimizedTime: 355,
  },
  {
    id: 'route-3',
    technicianId: 'tech-3',
    date: '2026-01-22',
    stops: [
      {
        id: 'stop-19',
        order: 1,
        customerId: 'cust-6',
        customerName: 'Anderson Pool',
        address: '1111 Mountain View',
        estimatedArrival: '8:00 AM',
        estimatedDuration: 55,
        status: 'completed',
        lat: 33.4152,
        lng: -111.8315,
      },
      {
        id: 'stop-20',
        order: 2,
        customerId: 'cust-8',
        customerName: 'Wilson Family',
        address: '789 Hillside Dr',
        estimatedArrival: '9:15 AM',
        estimatedDuration: 50,
        status: 'completed',
        lat: 33.5722,
        lng: -111.9260,
      },
      {
        id: 'stop-21',
        order: 3,
        customerId: 'cust-5',
        customerName: 'Garcia Family',
        address: '678 Desert Rose',
        estimatedArrival: '10:30 AM',
        estimatedDuration: 35,
        status: 'completed',
        lat: 33.4255,
        lng: -111.9400,
      },
      {
        id: 'stop-22',
        order: 4,
        customerId: 'cust-4',
        customerName: 'Thompson Home',
        address: '2345 Cactus Way',
        estimatedArrival: '11:30 AM',
        estimatedDuration: 45,
        status: 'completed',
        lat: 33.4556,
        lng: -112.0654,
      },
    ],
    totalDistance: 38.7,
    estimatedTime: 265,
    optimizedDistance: 31.2,
    optimizedTime: 225,
  },
];

// Alerts
export const alerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'chemistry',
    severity: 'high',
    title: 'High pH Level',
    message: 'Anderson Pool pH reading was 8.2 - needs acid adjustment',
    customerId: 'cust-6',
    timestamp: '2026-01-22T14:30:00',
  },
  {
    id: 'alert-2',
    type: 'equipment',
    severity: 'medium',
    title: 'Filter Pressure High',
    message: 'Williams Estate filter showing 28 PSI - consider backwash',
    customerId: 'cust-3',
    timestamp: '2026-01-22T11:15:00',
  },
  {
    id: 'alert-3',
    type: 'overdue',
    severity: 'high',
    title: 'Service Overdue',
    message: 'Brown Pool House was scheduled for Jan 16 - 6 days overdue',
    customerId: 'cust-9',
    timestamp: '2026-01-22T08:00:00',
  },
  {
    id: 'alert-4',
    type: 'weather',
    severity: 'low',
    title: 'Rain Expected',
    message: 'Light rain forecast for Friday - consider adjusting chemicals',
    timestamp: '2026-01-22T07:00:00',
  },
];

// Service history
export const serviceHistory: ServiceLog[] = [
  {
    id: 'log-1',
    customerId: 'cust-1',
    technicianId: 'tech-1',
    date: '2026-01-20',
    startTime: '8:15 AM',
    endTime: '9:00 AM',
    chemistry: {
      chlorine: 2.5,
      ph: 7.4,
      alkalinity: 95,
      cyanuricAcid: 45,
      calcium: 280,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Check filter', 'Test chemistry', 'Add chlorine'],
    notes: 'Pool looking great. Added 1 lb chlorine.',
    photos: [],
  },
  {
    id: 'log-2',
    customerId: 'cust-1',
    technicianId: 'tech-1',
    date: '2026-01-13',
    startTime: '8:30 AM',
    endTime: '9:20 AM',
    chemistry: {
      chlorine: 1.8,
      ph: 7.6,
      alkalinity: 100,
      cyanuricAcid: 42,
      calcium: 275,
    },
    tasks: ['Skim surface', 'Brush walls', 'Vacuum', 'Backwash filter', 'Test chemistry', 'Add acid'],
    notes: 'pH slightly high, added 1 qt acid. Backwashed filter - was at 22 PSI.',
    photos: [],
  },
  {
    id: 'log-3',
    customerId: 'cust-1',
    technicianId: 'tech-1',
    date: '2026-01-06',
    startTime: '8:00 AM',
    endTime: '8:45 AM',
    chemistry: {
      chlorine: 3.0,
      ph: 7.5,
      alkalinity: 90,
      cyanuricAcid: 40,
      calcium: 270,
    },
    tasks: ['Skim surface', 'Brush walls', 'Test chemistry'],
    notes: 'Quick service - pool in excellent condition.',
    photos: [],
  },
];

// Weekly stats
export const weeklyStats = {
  revenue: 4420,
  revenueChange: 8.5,
  poolsDone: 48,
  poolsTotal: 62,
  timeSaved: 3.2,
  fuelSaved: 47,
  avgServiceTime: 42,
  customerSatisfaction: 4.8,
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
