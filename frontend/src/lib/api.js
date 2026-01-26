import axios from 'axios';

const api = axios.create({
  baseURL: '/',
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---------------- AUTH ----------------
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', { email, password });
  return response.data;
};

// ---------------- UPLOAD ----------------
export const uploadImages = async (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }
  const response = await api.post('/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  console.log("DEBUG: uploadImages API raw response:", response.data);
  return { images: response.data };
};

// ---------------- MACHINES ----------------
export const getMachines = async (type, category) => {
  const params = {};
  if (type) params.type = type;
  if (category) params.category = category;

  const response = await api.get('/api/machines', { params });
  return response.data;
};

export const getMachine = async (id) => {
  const response = await api.get(`/api/machines/${id}`);
  return response.data;
};

export const addMachine = async (machineData) => {
  const response = await api.post('/admin/machines', machineData);
  return response.data;
};

export const updateMachine = async (id, machineData) => {
  const response = await api.put(`/admin/machines/${id}`, machineData);
  return response.data;
};

export const deleteMachine = async (id) => {
  const response = await api.delete(`/admin/machines/${id}`);
  return response.data;
};

// ---------------- PARTS ----------------
export const getParts = async () => {
  const response = await api.get('/api/parts');
  return response.data;
};

export const addPart = async (partData) => {
  const response = await api.post('/admin/parts', partData);
  return response.data;
};

export const deletePart = async (id) => {
  const response = await api.delete(`/admin/parts/${id}`);
  return response.data;
};

// ---------------- BLOGS ----------------
export const getBlogs = async () => {
  const response = await api.get('/api/blogs');
  return response.data;
};

export const getBlog = async (id) => {
  const response = await api.get(`/api/blogs/${id}`);
  return response.data;
};

export const addBlog = async (blogData) => {
  const response = await api.post('/admin/blogs', blogData);
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/admin/blogs/${id}`);
  return response.data;
};

// ---------------- ENQUIRIES ----------------
export const submitEnquiry = async (enquiryData) => {
  const response = await api.post('/api/enquiry', enquiryData);
  return response.data;
};

export const getEnquiries = async () => {
  const response = await api.get('/admin/enquiries');
  return response.data;
};

export const getDashboardCounts = async () => {
  const response = await api.get('/admin/dashboard/counts');
  return response.data;
};

export const markEnquiriesAsRead = async () => {
  const response = await api.post('/admin/enquiries/mark-read');
  return response.data;
};

