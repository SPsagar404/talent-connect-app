import api from './api';

export const emailService = {
    /** Send emails to selected HR contacts */
    send: (data) => api.post('/emails/send', data),
};
