import React, { useState } from 'react';
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  Switch,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Email, VpnKey, Palette } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../theme';

const Settings: React.FC = () => {
  const { user, updateEmail, updatePassword } = useAuth();
  const { toggleTheme, mode } = useThemeContext();
  const isDark = mode === 'dark';

  const [email, setEmail] = useState(user?.email || '');
  const [emailMsg, setEmailMsg] = useState('');
  const [emailError, setEmailError] = useState('');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg('');
    setEmailError('');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setEmailError('Please enter a valid email.');
      return;
    }
    const success = await updateEmail(email);
    success ? setEmailMsg('Email updated successfully.') : setEmailError('Email already in use or update failed.');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setPasswordError('Passwords do not match.');
      return;
    }
    const success = await updatePassword(password);
    if (success) {
      setPasswordMsg('Password updated successfully.');
      setPassword('');
      setConfirm('');
    } else {
      setPasswordError('Password update failed.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        background: isDark
          ? 'linear-gradient(to right, #1f2937, #111827)'
          : 'linear-gradient(to right, #e0eafc, #cfdef3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: 620 }}
      >
        <Paper
          elevation={5}
          sx={{
            borderRadius: 4,
            p: 4,
            background: isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            border: isDark ? '1px solid #333' : '1px solid #ddd',
          }}
        >
          <Typography variant="h4" fontWeight={700} color="primary" mb={3}>
            ✨ Settings Center
          </Typography>

          {/* Email Section */}
          <Box component="form" onSubmit={handleEmailUpdate} mb={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <Email color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Update Email
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 1 }}
            />
            {emailError && <Alert severity="error" sx={{ mb: 1 }}>{emailError}</Alert>}
            {emailMsg && <Alert severity="success" sx={{ mb: 1 }}>{emailMsg}</Alert>}
            <Button
              variant="contained"
              fullWidth
              color="secondary"
              type="submit"
              sx={{
                fontWeight: 600,
                py: 1.3,
                background: 'linear-gradient(to right, #8e2de2, #4a00e0)',
              }}
            >
              Save Email
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Password Section */}
          <Box component="form" onSubmit={handlePasswordUpdate} mb={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <VpnKey color="secondary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Update Password
              </Typography>
            </Box>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              sx={{ mb: 1 }}
            />
            {passwordError && <Alert severity="error" sx={{ mb: 1 }}>{passwordError}</Alert>}
            {passwordMsg && <Alert severity="success" sx={{ mb: 1 }}>{passwordMsg}</Alert>}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{
                fontWeight: 600,
                py: 1.3,
                background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
              }}
            >
              Save Password
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Theme Toggle */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Palette color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Theme Mode
              </Typography>
            </Box>
            <Switch checked={isDark} onChange={toggleTheme} />
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default Settings;
