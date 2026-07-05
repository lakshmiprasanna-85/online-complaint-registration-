import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Rating,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import api from '../services/api';
import { useComplaints } from '../context/ComplaintContext';
import { toast } from 'react-toastify';

const FeedbackPage = () => {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { getComplaint } = useComplaints();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [existingFeedback, setExistingFeedback] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getComplaint(complaintId);
        setComplaint(data);
        try {
          const { data: fb } = await api.get(`/feedback/complaint/${complaintId}`);
          setExistingFeedback(fb.data);
        } catch {
          // no feedback yet
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [complaintId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post(`/feedback/${complaintId}`, { rating, comment });
      toast.success('Thank you for your feedback!');
      navigate(`/complaints/${complaintId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Paper sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={800} gutterBottom>
          Rate Your Experience
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Complaint: {complaint?.ticketId} — {complaint?.title}
        </Typography>

        {existingFeedback ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" gutterBottom>
              You already submitted feedback
            </Typography>
            <Rating value={existingFeedback.rating} readOnly size="large" sx={{ mb: 2 }} />
            {existingFeedback.comment && (
              <Typography variant="body1" color="text.secondary">
                &ldquo;{existingFeedback.comment}&rdquo;
              </Typography>
            )}
            <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 3 }}>
              Back to Dashboard
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography component="legend" fontWeight={600} gutterBottom>
              How satisfied are you with the resolution?
            </Typography>
            <Rating
              value={rating}
              onChange={(_, v) => setRating(v)}
              size="large"
              sx={{ mb: 3, fontSize: '2.5rem' }}
            />
            <TextField
              fullWidth
              label="Comments (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              multiline
              rows={4}
              placeholder="Tell us about your experience..."
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Send />}
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : 'Submit Feedback'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default FeedbackPage;
