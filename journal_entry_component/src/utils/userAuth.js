/**
 * User Authentication Module
 * Contains static user details and validation functions
 */

// Static user details
const user = {
    username: 'Vikram',
    email: 'vikramkaza@gmail.com',
    password: 'Vikram2002@'
};

/**
 * PUBLIC_INTERFACE
 * Validates email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * PUBLIC_INTERFACE
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements, false otherwise
 */
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

/**
 * PUBLIC_INTERFACE
 * Validates username
 * Requirements:
 * - At least 3 characters
 * - Contains only alphanumeric characters and underscores
 * @param {string} username - Username to validate
 * @returns {boolean} - True if username is valid, false otherwise
 */
const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
};

// Export user object and validation functions
export {
    user,
    validateEmail,
    validatePassword,
    validateUsername
};
