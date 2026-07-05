import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Divider,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import api from '../services/api';
import { connectSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/constants';

const ChatBox = ({ complaintId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${complaintId}`);
        setMessages(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [complaintId]);

  useEffect(() => {
    const socket = connectSocket();
    socket.emit('join-complaint', complaintId);

    const handleNewMessage = (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    socket.on('new-message', handleNewMessage);
    return () => {
      socket.off('new-message', handleNewMessage);
      socket.emit('leave-complaint', complaintId);
    };
  }, [complaintId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const { data } = await api.post(`/messages/${complaintId}`, { message: newMessage.trim() });
      setMessages((prev) => {
        if (prev.some((m) => m._id === data.data._id)) return prev;
        return [...prev, data.data];
      });
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 420,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>
          Live Chat
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Real-time communication with your support agent
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: '#fafbfc' }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            Loading messages...
          </Typography>
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.sender._id === user._id;
            return (
              <Box
                key={msg._id || idx}
                sx={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: isOwn ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1,
                    maxWidth: '75%',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 12,
                      bgcolor: isOwn ? 'primary.main' : 'secondary.main',
                    }}
                  >
                    {getInitials(msg.sender.name)}
                  </Avatar>
                  <Box>
                    <Paper
                      elevation={0}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        bgcolor: isOwn ? 'primary.main' : 'white',
                        color: isOwn ? 'white' : 'text.primary',
                        border: isOwn ? 'none' : '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2">{msg.message}</Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5, textAlign: isOwn ? 'right' : 'left', px: 0.5 }}
                    >
                      {msg.sender.name} · {formatDate(msg.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={bottomRef} />
      </Box>

      <Divider />
      <Box component="form" onSubmit={handleSend} sx={{ p: 1.5, display: 'flex', gap: 1, bgcolor: 'white' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!newMessage.trim() || sending}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: '#e2e8f0' },
          }}
        >
          <Send fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatBox;
