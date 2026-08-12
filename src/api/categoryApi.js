import { createApiClient } from "../config/api";

const axiosInstance = createApiClient("/categories");

export const getAllCategories = async () => {
    const response = await axiosInstance.get('');
    const data = response.data;
    return Array.isArray(data) ? data : data?.data ?? [];
};

// '' rather than '/' — see the note in orchidApi.js: a trailing slash turns the
// create request into a 401 under Spring Boot 3.
export const createCategory = async (categoryData) => {
    const response = await axiosInstance.post('', categoryData);
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
