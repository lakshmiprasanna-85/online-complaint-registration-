import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material';
import {
  Speed,
  Security,
  Analytics,
  Chat,
  ArrowForward,
  CheckCircle,
  Groups,
  TrendingUp,
  SupportAgent,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../utils/constants';

const features = [
  {
    icon: <Speed sx={{ fontSize: 32 }} />,
    title: 'Fast Resolution',
    description: 'Submit complaints in seconds and track progress in real-time with instant status updates.',
    color: '#6366f1',
  },
  {
    icon: <Chat sx={{ fontSize: 32 }} />,
    title: 'Live Chat',
    description: 'Communicate directly with assigned agents through built-in real-time messaging.',
    color: '#8b5cf6',
  },
  {
    icon: <Security sx={{ fontSize: 32 }} />,
    title: 'Secure & Private',
    description: 'JWT authentication, encrypted passwords, and role-based access keep your data safe.',
    color: '#10b981',
  },
  {
    icon: <Analytics sx={{ fontSize: 32 }} />,
    title: 'Admin Analytics',
    description: 'Powerful dashboards with performance metrics, trends, and agent insights.',
    color: '#f59e0b',
  },
];

const stats = [
  { value: '99%', label: 'Resolution Rate' },
  { value: '< 24h', label: 'Avg Response Time' },
  { value: '4.8★', label: 'User Satisfaction' },
  { value: '10K+', label: 'Complaints Resolved' },
];

const HomePage = () => {
  const { user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-30%',
            left: '-5%',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                label="Complaint Management Platform"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(99,102,241,0.2)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.4)',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.15,
                  mb: 3,
                }}
              >
                Resolve complaints{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  faster & smarter
                </Box>
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 540, lineHeight: 1.7 }}>
                A transparent platform connecting users, agents, and administrators for efficient
                complaint handling with real-time updates and performance insights.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  component={Link}
                  to={user ? getDashboardPath(user.role) : '/register'}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
                >
                  {user ? 'Go to Dashboard' : 'Start Free Today'}
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  p: 3,
                }}
              >
                {[
                  { ticket: 'CMP-000042', status: 'In Progress', color: '#f59e0b' },
                  { ticket: 'CMP-000041', status: 'Resolved', color: '#10b981' },
                  { ticket: 'CMP-000040', status: 'Assigned', color: '#8b5cf6' },
                ].map((item) => (
                  <Box
                    key={item.ticket}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 2,
                      mb: 1.5,
                      bgcolor: 'rgba(255,255,255,0.05)',
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: '#a5b4fc' }}>
                        {item.ticket}
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        Complaint tracking live
                      </Typography>
                    </Box>
                    <Chip
                      label={item.status}
                      size="small"
                      sx={{ bgcolor: `${item.color}30`, color: item.color, fontWeight: 600 }}
                    />
                  </Box>
                ))}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, px: 1 }}>
                  <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                    Real-time status updates enabled
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box sx={{ bgcolor: 'white', py: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {stats.map((stat) => (
              <Grid key={stat.label} size={{ xs: 6, md: 3 }}>
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight={800} color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="overline" color="primary" fontWeight={700}>
            Platform Features
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
            Everything you need to manage complaints
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={600} mx="auto">
            Built for users, agents, and administrators with role-based dashboards and seamless workflows.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid key={feature.title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 40px ${feature.color}20`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: `${feature.color}15`,
                      color: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Roles Section */}
      <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Built for every role
              </Typography>
              <Stack spacing={2} mt={3}>
                {[
                  { icon: <Groups />, role: 'Users', desc: 'Submit, track, chat, and provide feedback' },
                  { icon: <SupportAgent />, role: 'Agents', desc: 'Manage assigned cases and update progress' },
                  { icon: <TrendingUp />, role: 'Admins', desc: 'Assign agents, manage users, view analytics' },
                ].map((item) => (
                  <Box key={item.role} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {item.role}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: 4,
                  p: { xs: 4, md: 5 },
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Ready to get started?
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.85, mb: 3 }}>
                  Join ResolveHub and experience transparent complaint management today.
                </Typography>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  Create Free Account
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
