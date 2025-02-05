import axios from 'axios';

export class ApiError {
    constructor(public message: string, public status: number, public cause?: any) {}
}

const api = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    baseURL: process.env.REACT_APP_BACKEND_URL
});

export default api;

