import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import { ArrowForward, PriorityHigh } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import StatusChip from './StatusChip';
import { PRIORITY_COLORS, formatDate } from '../utils/constants';

const ComplaintCard = ({ complaint, showUser = false }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/complaints/${complaint._id}`)}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(99, 102, 241, 0.12)',
          borderColor: '#6366f140',
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box>
            <Typography variant="caption" color="primary" fontWeight={700}>
              {complaint.ticketId}
            </Typography>
            <Typography variant="h6" fontWeight={600} sx={{ mt: 0.5, lineHeight: 1.3 }}>
              {complaint.title}
            </Typography>
          </Box>
          <StatusChip status={complaint.status} />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {complaint.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip label={complaint.category} size="small" variant="outlined" />
            <Chip
              icon={<PriorityHigh sx={{ fontSize: 14 }} />}
              label={complaint.priority}
              size="small"
              sx={{ color: PRIORITY_COLORS[complaint.priority], borderColor: PRIORITY_COLORS[complaint.priority] }}
              variant="outlined"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showUser && complaint.user && (
              <Typography variant="caption" color="text.secondary">
                {complaint.user.name}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {formatDate(complaint.createdAt)}
            </Typography>
            <ArrowForward sx={{ fontSize: 16, color: 'primary.main' }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ComplaintCard;
