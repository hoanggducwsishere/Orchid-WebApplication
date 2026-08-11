import axios from "axios";

const categoryUrl = 'http://localhost:8080/api/categories';

const axiosInstance = axios.create({
    baseURL: categoryUrl
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

export const getAllCategories = async () => {
    const response = await axiosInstance.get('');
    const data = response.data;
    return Array.isArray(data) ? data : data?.data ?? [];
};

export const createCategory = async (categoryData) => {
    const response = await axiosInstance.post('/', categoryData);
    return response.data;
};

export const updateCategory = async (id, categoryData) => {
    const response = await axiosInstance.put(`/${id}`, categoryData);
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
};
