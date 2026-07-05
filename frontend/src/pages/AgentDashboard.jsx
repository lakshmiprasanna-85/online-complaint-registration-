import { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Assignment, CheckCircle, HourglassEmpty, Star } from '@mui/icons-material';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import StatsCard from '../components/StatsCard';
import api from '../services/api';
import { useState } from 'react';

const AgentDashboard = () => {
  const { complaints, loading, fetchAgentComplaints } = useComplaints();
  const [feedbackStats, setFeedbackStats] = useState({ averageRating: 0, count: 0 });

  useEffect(() => {
    fetchAgentComplaints();
    api.get('/feedback/agent/me').then(({ data }) => {
      setFeedbackStats({ averageRating: data.averageRating, count: data.count });
    }).catch(() => {});
  }, [fetchAgentComplaints]);

  const stats = {
    assigned: complaints.length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Agent Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your assigned complaints and update progress
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Assigned Cases" value={stats.assigned} icon={<Assignment />} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="In Progress" value={stats.inProgress} icon={<HourglassEmpty />} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Resolved" value={stats.resolved} icon={<CheckCircle />} color="#10b981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Avg Rating"
            value={feedbackStats.averageRating || '—'}
            subtitle={`${feedbackStats.count} reviews`}
            icon={<Star />}
            color="#8b5cf6"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Assigned Complaints
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : complaints.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc' }}>
          <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6">No assigned complaints</Typography>
          <Typography variant="body2" color="text.secondary">
            New cases will appear here when an admin assigns them to you.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {complaints.map((complaint) => (
            <Grid key={complaint._id} size={{ xs: 12, md: 6 }}>
              <ComplaintCard complaint={complaint} showUser />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default AgentDashboard;
