import api from './api';

export const resumeService = {
    /** Upload a resume file (accepts FormData with 'file' field) */
    upload: (formData) => {
        return api.post('/resume/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    /** Get resume info */
    getInfo: () => api.get('/resume'),
};
