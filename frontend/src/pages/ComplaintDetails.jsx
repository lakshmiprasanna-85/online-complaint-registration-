import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Divider,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { ArrowBack, RateReview, Person, SupportAgent } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useComplaints } from '../context/ComplaintContext';
import StatusChip from '../components/StatusChip';
import ChatBox from '../components/ChatBox';
import { formatDate, PRIORITY_COLORS, STATUSES } from '../utils/constants';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getComplaint, updateComplaint } = useComplaints();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadComplaint = async () => {
    setLoading(true);
    try {
      const data = await getComplaint(id);
      setComplaint(data);
      setStatus(data.status);
      setResolutionNotes(data.resolutionNotes || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaint();
  }, [id]);

  const isOwner = complaint?.user?._id === user?._id || complaint?.user === user?._id;
  const isAgent =
    complaint?.assignedAgent?._id === user?._id || complaint?.assignedAgent === user?._id;
  const canUpdate = (user?.role === 'AGENT' && isAgent) || user?.role === 'ADMIN';
  const canChat = isOwner || isAgent || user?.role === 'ADMIN';
  const canFeedback =
    isOwner && ['Resolved', 'Closed'].includes(complaint?.status);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const updated = await updateComplaint(id, { status, resolutionNotes });
      setComplaint(updated);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (!complaint) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6">Complaint not found</Typography>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="overline" color="primary" fontWeight={700}>
                  {complaint.ticketId}
                </Typography>
                <Typography variant="h5" fontWeight={800}>
                  {complaint.title}
                </Typography>
              </Box>
              <StatusChip status={complaint.status} size="medium" />
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
              <Chip label={complaint.category} variant="outlined" />
              <Chip
                label={`Priority: ${complaint.priority}`}
                sx={{ color: PRIORITY_COLORS[complaint.priority], borderColor: PRIORITY_COLORS[complaint.priority] }}
                variant="outlined"
              />
              <Chip label={`Created ${formatDate(complaint.createdAt)}`} variant="outlined" size="small" />
            </Box>

            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              {complaint.description}
            </Typography>

            {complaint.resolutionNotes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" color="success.main" gutterBottom>
                  Resolution Notes
                </Typography>
                <Typography variant="body1">{complaint.resolutionNotes}</Typography>
              </>
            )}

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Person color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Submitted by
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {complaint.user?.name || 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SupportAgent color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Assigned Agent
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {complaint.assignedAgent?.name || 'Not assigned yet'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {canFeedback && (
              <Button
                variant="outlined"
                startIcon={<RateReview />}
                onClick={() => navigate(`/feedback/${complaint._id}`)}
                sx={{ mt: 3 }}
              >
                Submit Feedback
              </Button>
            )}
          </Paper>

          {canUpdate && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Update Complaint
              </Typography>
              <TextField
                fullWidth
                select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ mb: 2 }}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Resolution Notes"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handleUpdate} disabled={updating}>
                {updating ? <CircularProgress size={22} /> : 'Save Changes'}
              </Button>
            </Paper>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          {canChat && complaint.assignedAgent ? (
            <ChatBox complaintId={complaint._id} />
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc' }}>
              <SupportAgent sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {complaint.assignedAgent
                  ? 'Chat will be available once you have access.'
                  : 'Chat will be available after an agent is assigned.'}
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ComplaintDetails;
