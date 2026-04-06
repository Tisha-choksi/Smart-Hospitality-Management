const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPassword = (password) => {
    return password && password.length >= 8;
};

const validatePassword = (password) => {
    if (!password || password.length < 8) {
        return false;
    }
    return true;
};

const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

const isValidDate = (date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
};

const validatePagination = (page, limit) => {
    const validPage = Math.max(1, page || 1);
    const validLimit = Math.min(100, Math.max(1, limit || 10));
    return { page: validPage, limit: validLimit, skip: (validPage - 1) * validLimit };
};

const sanitizeString = (str) => {
    return str.trim().replace(/[<>]/g, '');
};

module.exports = {
    isValidEmail,
    isValidPassword,
    validatePassword,
    isValidPhoneNumber,
    isValidDate,
    validatePagination,
    sanitizeString,
};