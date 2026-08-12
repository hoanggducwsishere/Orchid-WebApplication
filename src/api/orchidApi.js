import axios from "axios";
import { API_BASE_URL } from "../config/api";

const baseUrl = `${API_BASE_URL}/orchids`;

const axiosInstance = axios.create({
    baseURL: baseUrl
});

// Add a request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user && user.token) {
                config.headers['Authorization'] = 'Bearer ' + user.token;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getAllOrchids = async () => {
    const response = await axiosInstance.get('');
    const data = response.data;
    return Array.isArray(data) ? data : data?.data ?? [];
};

export const createOrchid = async (orchidData) => {
    const response = await axiosInstance.post('/', orchidData);
    return response.data;
};

export const updateOrchid = async (id, orchidData) => {
    const response = await axiosInstance.put(`/${id}`, orchidData);
    return response.data;
};

export const deleteOrchid = async (id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
};