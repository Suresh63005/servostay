import axios from "axios";

const api = axios.create({


  // baseURL: "http://localhost:5000",
  // baseURL: 'https://property-rental-backend-ten.vercel.app',
  // baseURL: 'https://property-rental-backend-5.onrender.com',
  // baseURL: 'https://property-rental-backend-6.onrender.com',
  baseURL: 'https://property-rental-backend-two.vercel.app/',
  withCredentials: true,


});

export default api;
