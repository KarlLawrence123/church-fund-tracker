// Mock data for testing without Firebase
export const mockMembers = [
  {
    id: 'member-1',
    name: 'John Smith',
    email: 'john.smith@church.com',
    phone: '09123456789',
    joinDate: '2024-01-15',
    status: 'active'
  },
  {
    id: 'member-2',
    name: 'Mary Johnson',
    email: 'mary.johnson@church.com',
    phone: '09123456790',
    joinDate: '2024-02-20',
    status: 'active'
  },
  {
    id: 'member-3',
    name: 'David Chen',
    email: 'david.chen@church.com',
    phone: '09123456791',
    joinDate: '2024-03-10',
    status: 'active'
  }
];

export const mockContributions = [
  {
    id: 'contrib-1',
    memberId: 'member-1',
    memberName: 'John Smith',
    amount: 30,
    date: '2024-01-21',
    weekNumber: 3,
    year: 2024,
    status: 'paid'
  },
  {
    id: 'contrib-2',
    memberId: 'member-2',
    memberName: 'Mary Johnson',
    amount: 30,
    date: '2024-01-21',
    weekNumber: 3,
    year: 2024,
    status: 'paid'
  },
  {
    id: 'contrib-3',
    memberId: 'member-3',
    memberName: 'David Chen',
    amount: 30,
    date: '2024-01-21',
    weekNumber: 3,
    year: 2024,
    status: 'paid'
  }
];

export const mockExpenses = [
  {
    id: 'expense-1',
    description: 'Church Supplies',
    amount: 5000,
    category: 'supplies',
    date: '2024-01-15',
    approvedBy: 'Admin',
    status: 'approved'
  },
  {
    id: 'expense-2',
    description: 'Electricity Bill',
    amount: 3500,
    category: 'utilities',
    date: '2024-01-20',
    approvedBy: 'Admin',
    status: 'approved'
  },
  {
    id: 'expense-3',
    description: 'Maintenance',
    amount: 2000,
    category: 'maintenance',
    date: '2024-01-18',
    approvedBy: 'Admin',
    status: 'approved'
  }
];

export const mockWeeklySummaries = [
  {
    id: 'week-3-2024',
    weekNumber: 3,
    year: 2024,
    date: '2024-01-21',
    expectedCollection: 90,
    actualCollection: 90,
    totalExpenses: 10500,
    runningBalance: 25000,
    memberCount: 3
  }
];
