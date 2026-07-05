import { Chip } from '@mui/material';
import { STATUS_COLORS } from '../utils/constants';

const StatusChip = ({ status, size = 'small' }) => {
  const colors = STATUS_COLORS[status] || { bg: '#e2e8f0', color: '#475569' };
  return (
    <Chip
      label={status}
      size={size}
      sx={{
        bgcolor: colors.bg,
        color: colors.color,
        fontWeight: 600,
        border: 'none',
      }}
    />
  );
};

export default StatusChip;
