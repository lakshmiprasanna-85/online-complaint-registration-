import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add, Assignment, CheckCircle, HourglassEmpty, PendingActions } from '@mui/icons-material';
import { useComplaints } from '../context/ComplaintContext';
import ComplaintCard from '../components/ComplaintCard';
import StatsCard from '../components/StatsCard';
import { CATEGORIES } from '../utils/constants';

const UserDashboard = () => {
  const { complaints, loading, fetchMyComplaints, createComplaint } = useComplaints();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
  });

  useEffect(() => {
    fetchMyComplaints();
  }, [fetchMyComplaints]);

  const stats = {
    total: complaints.length,
    active: complaints.filter((c) => !['Resolved', 'Closed', 'Rejected'].includes(c.status)).length,
    resolved: complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length,
    pending: complaints.filter((c) => c.status === 'Submitted').length,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createComplaint(form);
      setOpen(false);
      setForm({ title: '', description: '', category: '', priority: 'Medium' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>
            My Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage your complaints
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} size="large">
          New Complaint
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Total Complaints" value={stats.total} icon={<Assignment />} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Active" value={stats.active} icon={<HourglassEmpty />} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Resolved" value={stats.resolved} icon={<CheckCircle />} color="#10b981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Awaiting Assignment" value={stats.pending} icon={<PendingActions />} color="#8b5cf6" />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        Your Complaints
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : complaints.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            bgcolor: '#f8fafc',
            border: '2px dashed',
            borderColor: 'divider',
          }}
        >
          <Assignment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No complaints yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Submit your first complaint and we&apos;ll help you resolve it quickly.
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
            Submit Complaint
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {complaints.map((complaint) => (
            <Grid key={complaint._id} size={{ xs: 12, md: 6 }}>
              <ComplaintCard complaint={complaint} />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight={700}>Submit New Complaint</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              sx={{ mb: 2 }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                <MenuItem key={p} value={p}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? <CircularProgress size={22} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
};

export default UserDashboard;
