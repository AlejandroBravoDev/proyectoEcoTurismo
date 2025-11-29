// archivo para peticiones http

import axios from "axios";
const API = "http://localhost:8000/api";

export const getLugares = (params) => {
  return axios.get(`${API}/lugares`, { params });
};

export const getMunicipios = () => {
  return axios.get(`${API}/municipios`);
};

export const deleteLugar = (id) => {
  const token = localStorage.getItem("token");
  return axios.delete(`${API}/lugares/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
