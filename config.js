// Environment variables
export const NODE_ENV = process.env.NODE_ENV;
export const connectionString = process.env.DATABASE_URL;

// HTTP status codes
export const BAD_REQUEST = 400;

// DB values
export const FIRST_NAME_COLUMN_MAX_LENGTH = 255;
export const LAST_NAME_COLUMN_MAX_LENGTH = 255;
export const PASSWORD_COLUMN_MAX_LENGTH = 50; // See link for reason: https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length

// Form constraints
export const PASSWORD_MIN_LENGTH = 8;
