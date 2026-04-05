import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4001/api",
});




export const IMAGE_URL = "http://localhost:4001/uploads/";
export const mediaSrc = "http://localhost:4001";

/* ================= AUTH ================= */
export const login = async (credentials) => {
  const { data } = await API.post("/login", credentials);
  return data;
};

export const register = async (userData) => {
  const { data } = await API.post("/register", userData);
  return data;
};

// ✅ GET ALL
export const getTestimonials = async () => {
  const { data } = await API.get("/alltestimonials");
  return data;
};

// ✅ CREATE
export const addTestimonial = async (formData, token) => {
  const { data } = await API.post("/addtestimonials", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ✅ UPDATE
export const updateTestimonial = async (id, formData, token) => {
  const { data } = await API.put(`/updatetestimonials/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ✅ GET ALL BLOGS
export const getBlogs = async () => {
  const { data } = await API.get("/allblogs");
  return data;
};

// ✅ ADD BLOG
export const addBlog = async (formData, token) => {
  const { data } = await API.post("/addblogs", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ✅ UPDATE BLOG
export const updateBlog = async (id, formData, token) => {
  const { data } = await API.put(`/updateblogs/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

/* ================= CATEGORY ================= */

// ✅ GET ALL
export const getCategories = async () => {
  const { data } = await API.get("/allcategory");
  return data;  
};

// ✅ ADD
export const addCategory = async (payload, token) => {
   const { data } = await API.post("/addcategory", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

// ✅ UPDATE
export const updateCategory = async (id, payload) => {
  const { data } = await API.put(`/updatecategory/${id}`, payload);
  return data;
};

/* ================= CONTACT US ================= */

// ✅ GET ALL
export const getContactMessages = async () => {
  const { data } = await API.get("/contactus");
  return data;
};

// ✅ UPDATE STATUS (READ / UNREAD)
export const updateContactStatus = async (id, payload) => {
  const { data } = await API.put(`/contactusstatus/${id}`, payload);
  return data;
};

// ✅ DELETE
export const deleteContact = async (id) => {
  const { data } = await API.delete(`/contactus/${id}`);
  return data;
};

/* ================= CURRENCY ================= */

// ✅ GET ALL
export const getCurrencies = async () => {
  const { data } = await API.get("/allcurrency");
  return data;
};

// ✅ CREATE
export const createCurrency = async (payload) => {
  const { data } = await API.post("/createcurrency", payload);
  return data;
};

// ✅ UPDATE
export const updateCurrency = async (id, payload) => {
  const { data } = await API.put(`/updatecurrency/${id}`, payload);
  return data;
};

/* ================= DASHBOARD ================= */
export const getDashboardStats = async (start, end) => {
  const { data } = await API.get(`/stats?start=${start}&end=${end}`);
  return data;
}

export const getRecentOrders = async () => {
  const { data } = await API.get('/recent-orders');
  return data;
}

export const getAlerts = async () => {
  const { data } = await API.get('/alerts');
  return data;
}