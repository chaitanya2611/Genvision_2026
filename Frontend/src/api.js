import axios from "axios";

const API = axios.create({
  baseURL: "https://genvision-2026-1.onrender.com/api",
});

export default API;
