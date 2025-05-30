import axios from 'axios';
import {redirect } from "next/navigation";
import { tokenService } from './tokenService';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL
});

api.interceptors.request.use( config => {
    const token = tokenService.get();

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;

});

// Flag to avoid infinite loop
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach ( prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async (error)  => {
        const originalRequest = error.config;

        // If unauthorized and not already refreshing
        if (error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve : (token: string) => {
                            originalRequest.headers['Authorization'] = `Bearer ${token}`;
                            resolve(api(originalRequest));
                        },
                        reject: (err: any) => {reject(err)},
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await api.get("/refresh-token", {withCredentials: true});
                const newToken = res.data.accessToken;

                tokenService.set(newToken);

                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                processQueue(null, newToken);
                return api(originalRequest);

            } catch (err) {
                console.log(err)
                processQueue(err, null);
                
                redirect('/login');
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        } 

        return Promise.reject(error);
    }
)
