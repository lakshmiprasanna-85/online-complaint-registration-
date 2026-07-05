export const STATUS_COLORS = {
  Submitted: { bg: '#dbeafe', color: '#1d4ed8' },
  Assigned: { bg: '#ede9fe', color: '#6d28d9' },
  'In Progress': { bg: '#fef3c7', color: '#b45309' },
  Resolved: { bg: '#d1fae5', color: '#047857' },
  Closed: { bg: '#e2e8f0', color: '#475569' },
  Rejected: { bg: '#fee2e2', color: '#b91c1c' },
};

export const PRIORITY_COLORS = {
  Low: '#94a3b8',
  Medium: '#3b82f6',
  High: '#f59e0b',
  Critical: '#ef4444',
};

export const CATEGORIES = [
  'Billing',
  'Technical',
  'Service Quality',
  'Product Defect',
  'Delivery',
  'Account',
  'Other',
];

export const STATUSES = [
  'Submitted',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
  'Rejected',
];

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const getDashboardPath = (role) => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'AGENT':
      return '/agent/dashboard';
    default:
      return '/dashboard';
  }
};
