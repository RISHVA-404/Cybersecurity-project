import axios from 'axios';

// Dynamically use the current hostname so it works on LAN (e.g., 192.168.x.x) or localhost
const HOST = window.location.hostname;
const API_URL = import.meta.env.VITE_API_URL || `http://${HOST}:8000/api`;

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
