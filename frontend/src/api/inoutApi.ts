import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/inout",
  headers: {
    "Content-Type": "application/json",
  },
});
