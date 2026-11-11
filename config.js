// Environment variables
export const NODE_ENV = process.env.NODE_ENV;
export const CLUB_SECRET = process.env.CLUB_SECRET;
export const connectionString = process.env.DATABASE_URL;

// HTTP status codes
export const BAD_REQUEST = 400;
export const NOT_FOUND = 404;
export const INTERNAL_SERVER_ERROR = 500;

// DB values
export const FIRST_NAME_COLUMN_MAX_LENGTH = 255;
export const LAST_NAME_COLUMN_MAX_LENGTH = 255;
export const PASSWORD_COLUMN_MAX_LENGTH = 50; // See link for reason: https://security.stackexchange.com/questions/39849/does-bcrypt-have-a-maximum-password-length

// Form constraints
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LOWER_CASE = 1;
export const PASSWORD_MIN_UPPER_CASE = 1;
export const PASSWORD_MIN_NUMBERS = 1;
export const PASSWORD_MIN_SYMBOLS = 1;
