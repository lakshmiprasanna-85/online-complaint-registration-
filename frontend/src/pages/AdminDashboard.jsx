import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  MenuItem,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  People,
  SupportAgent,
  Assignment,
  Star,
  PersonOff,
  Person,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import api from '../services/api';
import StatsCard from '../components/StatsCard';
import ComplaintCard from '../components/ComplaintCard';
import StatusChip from '../components/StatusChip';
import { useComplaints } from '../context/ComplaintContext';
import { toast } from 'react-toastify';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

const AdminDashboard = () => {
  const { complaints, fetchAllComplaints, assignAgent } = useComplaints();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  const [assignDialog, setAssignDialog] = useState({ open: false, complaint: null, agentId: '' });
  const [statusFilter, setStatusFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, agentsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/agents'),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setAgents(agentsRes.data.data);
      await fetchAllComplaints(statusFilter ? { status: statusFilter } : {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleAssign = async () => {
    if (!assignDialog.agentId) return;
    await assignAgent(assignDialog.complaint._id, assignDialog.agentId);
    setAssignDialog({ open: false, complaint: null, agentId: '' });
    loadData();
  };

  const handleToggleStatus = async (userId) => {
    await api.put(`/admin/users/${userId}/toggle-status`);
    toast.success('User status updated');
    loadData();
  };

  const handleRoleChange = async (userId, role) => {
    await api.put(`/admin/users/${userId}/role`, { role });
    toast.success('Role updated');
    loadData();
  };

  if (loading && !stats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  const overview = stats?.overview || {};
  const statusData = stats?.statusBreakdown?.map((s) => ({ name: s._id, value: s.count })) || [];
  const categoryData = stats?.categoryBreakdown?.map((c) => ({ name: c._id, count: c.count })) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={800}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          System overview, analytics, and management
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Total Users" value={overview.totalUsers || 0} icon={<People />} color="#6366f1" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Active Agents" value={overview.totalAgents || 0} icon={<SupportAgent />} color="#8b5cf6" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard title="Total Complaints" value={overview.totalComplaints || 0} icon={<Assignment />} color="#f59e0b" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Avg Satisfaction"
            value={overview.averageRating || '—'}
            subtitle={`${overview.totalFeedback || 0} reviews`}
            icon={<Star />}
            color="#10b981"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, height: 340 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, height: 340 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Complaints by Category
            </Typography>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Complaints" />
          <Tab label="Users" />
          <Tab label="Agents" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  All Complaints
                </Typography>
                <TextField
                  select
                  size="small"
                  label="Filter by status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="">All</MenuItem>
                  {['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'].map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
              <Grid container spacing={2}>
                {complaints.map((complaint) => (
                  <Grid key={complaint._id} size={{ xs: 12, md: 6 }}>
                    <Box sx={{ position: 'relative' }}>
                      <ComplaintCard complaint={complaint} showUser />
                      {!complaint.assignedAgent && complaint.status === 'Submitted' && (
                        <Button
                          size="small"
                          variant="contained"
                          sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setAssignDialog({ open: true, complaint, agentId: '' });
                          }}
                        >
                          Assign Agent
                        </Button>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {tab === 1 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" color="action" />
                          {u.name}
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <TextField
                          select
                          size="small"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          sx={{ minWidth: 100 }}
                        >
                          {['USER', 'AGENT', 'ADMIN'].map((r) => (
                            <MenuItem key={r} value={r}>
                              {r}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.isActive ? 'Active' : 'Inactive'}
                          size="small"
                          color={u.isActive ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(u._id)}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <PersonOff fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 2 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Agent</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Assigned</TableCell>
                    <TableCell>Resolved</TableCell>
                    <TableCell>Available</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent._id} hover>
                      <TableCell>{agent.user?.name}</TableCell>
                      <TableCell>{agent.department}</TableCell>
                      <TableCell>{agent.assignedComplaints?.length || 0}</TableCell>
                      <TableCell>{agent.resolvedCount}</TableCell>
                      <TableCell>
                        <Chip
                          label={agent.isAvailable ? 'Yes' : 'No'}
                          size="small"
                          color={agent.isAvailable ? 'success' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {stats?.recentComplaints?.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Recent Activity
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ticket</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentComplaints.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.ticketId}</TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.user?.name}</TableCell>
                    <TableCell>{c.assignedAgent?.name || '—'}</TableCell>
                    <TableCell>
                      <StatusChip status={c.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={assignDialog.open} onClose={() => setAssignDialog({ open: false, complaint: null, agentId: '' })}>
        <DialogTitle>Assign Agent</DialogTitle>
        <DialogContent sx={{ minWidth: 360, pt: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Complaint: {assignDialog.complaint?.ticketId} — {assignDialog.complaint?.title}
          </Typography>
          <TextField
            fullWidth
            select
            label="Select Agent"
            value={assignDialog.agentId}
            onChange={(e) => setAssignDialog({ ...assignDialog, agentId: e.target.value })}
            sx={{ mt: 2 }}
          >
            {agents
              .filter((a) => a.isAvailable && a.user?.isActive)
              .map((agent) => (
                <MenuItem key={agent.user._id} value={agent.user._id}>
                  {agent.user.name} — {agent.department} ({agent.assignedComplaints?.length || 0} cases)
                </MenuItem>
              ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialog({ open: false, complaint: null, agentId: '' })}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign} disabled={!assignDialog.agentId}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
