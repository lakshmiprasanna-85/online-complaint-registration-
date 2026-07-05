import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Logout,
  Home,
  SupportAgent,
  AdminPanelSettings,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../utils/constants';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navLinks = user
    ? [
        { label: 'Dashboard', path: getDashboardPath(user.role), icon: <Dashboard fontSize="small" /> },
        ...(user.role === 'ADMIN'
          ? [{ label: 'Admin', path: '/admin/dashboard', icon: <AdminPanelSettings fontSize="small" /> }]
          : []),
        ...(user.role === 'AGENT'
          ? [{ label: 'My Cases', path: '/agent/dashboard', icon: <SupportAgent fontSize="small" /> }]
          : []),
      ]
    : [{ label: 'Home', path: '/', icon: <Home fontSize="small" /> }];

  const handleLogout = () => {
    logout();
    navigate('/');
    setAnchorEl(null);
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      {navLinks.map((link) => (
        <Button
          key={link.path}
          component={Link}
          to={link.path}
          startIcon={link.icon}
          onClick={() => mobile && setDrawerOpen(false)}
          sx={{
            color: location.pathname === link.path ? 'primary.main' : 'text.primary',
            fontWeight: location.pathname === link.path ? 700 : 500,
            mx: 0.5,
          }}
        >
          {link.label}
        </Button>
      ))}
    </>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isMobile && user && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SupportAgent sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ResolveHub
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavLinks />
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user ? (
              <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: 'primary.main',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.role} · {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { navigate(getDashboardPath(user.role)); setAnchorEl(null); }}>
                    <Dashboard fontSize="small" sx={{ mr: 1 }} /> Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" color="inherit" sx={{ fontWeight: 600 }}>
                  Login
                </Button>
                <Button component={Link} to="/register" variant="contained" size="small">
                  Get Started
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={location.pathname === link.path}
                >
                  {link.icon}
                  <ListItemText primary={link.label} sx={{ ml: 1 }} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <Logout fontSize="small" />
                <ListItemText primary="Logout" sx={{ ml: 1 }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
