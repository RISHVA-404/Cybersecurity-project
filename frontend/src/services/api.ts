import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const fetchTopology = async () => {
    const response = await axios.get(`${API_URL}/topology`);
    return response.data;
};

export const simulateIncident = async (scenario: string) => {
    const response = await axios.post(`${API_URL}/simulate/incident?scenario=${scenario}`);
    return response.data;
};

export const fetchIncidents = async () => {
    const response = await axios.get(`${API_URL}/incidents`);
    return response.data;
};

export const fetchRules = async () => {
    const response = await axios.get(`${API_URL}/rules`);
    return response.data;
};

export const updateRuleAction = async (ruleId: number, action: string) => {
    const response = await axios.put(`${API_URL}/rules/${ruleId}?action=${action}`);
    return response.data;
};

export const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const fetchAssets = async () => {
    const response = await axios.get(`${API_URL}/assets`);
    return response.data;
};

export const evaluateIAM = async (userId: number, assetId: number) => {
    const response = await axios.post(`${API_URL}/iam/evaluate`, {
        user_id: userId,
        asset_id: assetId
    });
    return response.data;
};
