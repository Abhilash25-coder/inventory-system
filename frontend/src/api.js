import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "https://inventory-system-ukca.onrender.com/api";

export const api = {
  getProducts: () => axios.get(`${API_BASE}/products`),
  getLedger: () => axios.get(`${API_BASE}/ledger`),
  simulate: () => axios.post(`${API_BASE}/simulate`),
  startProducer: () => axios.post(`${API_BASE}/producer/start`),
  stopProducer: () => axios.post(`${API_BASE}/producer/stop`),
};
