import api from './api';

export const hrService = {
    /** Get paginated/filtered HR list */
    getAll: (params) => api.get('/hr-details', { params }),

    /** Get single HR detail */
    getById: (id) => api.get(`/hr-details/${id}`),

    /** Create a new HR detail */
    create: (data) => api.post('/hr-details', data),

    /** Update HR detail */
    update: (id, data) => api.put(`/hr-details/${id}`, data),

    /** Delete HR detail */
    delete: (id) => api.delete(`/hr-details/${id}`),

    /** Get dashboard statistics */
    getStats: () => api.get('/hr-details/stats'),
};
