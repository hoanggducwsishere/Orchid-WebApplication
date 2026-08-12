import { createApiClient } from "../config/api";

const axiosInstance = createApiClient("/orchids");

export const getAllOrchids = async () => {
    const response = await axiosInstance.get('');
    const data = response.data;
    return Array.isArray(data) ? data : data?.data ?? [];
};

// Must be '' and not '/': axios would build ".../orchids/", and Spring Boot 3
// stopped matching trailing slashes by default, so the request falls through to
// the error dispatch and comes back as 401 instead of creating anything.
export const createOrchid = async (orchidData) => {
    const response = await axiosInstance.post('', orchidData);
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