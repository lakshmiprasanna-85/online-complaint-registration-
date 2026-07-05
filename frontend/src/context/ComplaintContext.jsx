import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/complaints/my');
      setComplaints(data.data);
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch complaints');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAgentComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/complaints/agent');
      setComplaints(data.data);
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch complaints');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllComplaints = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/complaints?${params}`);
      setComplaints(data.data);
      return data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch complaints');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createComplaint = async (formData) => {
    const { data } = await api.post('/complaints', formData);
    setComplaints((prev) => [data.data, ...prev]);
    toast.success('Complaint submitted successfully!');
    return data.data;
  };

  const updateComplaint = async (id, updates) => {
    const { data } = await api.put(`/complaints/${id}`, updates);
    setComplaints((prev) => prev.map((c) => (c._id === id ? data.data : c)));
    toast.success('Complaint updated!');
    return data.data;
  };

  const assignAgent = async (complaintId, agentId) => {
    const { data } = await api.put(`/complaints/${complaintId}/assign`, { agentId });
    setComplaints((prev) => prev.map((c) => (c._id === complaintId ? data.data : c)));
    toast.success('Agent assigned successfully!');
    return data.data;
  };

  const getComplaint = async (id) => {
    const { data } = await api.get(`/complaints/${id}`);
    return data.data;
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        loading,
        fetchMyComplaints,
        fetchAgentComplaints,
        fetchAllComplaints,
        createComplaint,
        updateComplaint,
        assignAgent,
        getComplaint,
        setComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) throw new Error('useComplaints must be used within ComplaintProvider');
  return context;
};
