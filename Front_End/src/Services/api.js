import axios from "axios";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
});

export const analyzeSpill = async (formData) => {
    const response = await API.post(
        "/api/analyze",
        formData
    );

    return response.data;
};

export default API;