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
export const PASSWORD_COLUMN_MAX_LENGTH = 255;
export const USERNAME_COLUMN_MAX_LENGTH = 255;

// Form constraints
export const FIRST_NAME_MAX_LENGTH = 50; // See link for reason: https://stackoverflow.com/questions/20958/list-of-standard-lengths-for-database-fields
export const LAST_NAME_MAX_LENGTH = 50; // See above link for reason: ^
export const USERNAME_MAX_LENGTH = 254; // See link for reason: https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 18; // = (72 bytes/4 bytes) - bcrypt truncates input past 72 bytes and utf-8 most bytes for a single character is likely to be 4 as stated in this discussion: https://stackoverflow.com/questions/9533258/what-is-the-maximum-number-of-bytes-for-a-utf-8-encoded-character
export const PASSWORD_MIN_LOWER_CASE = 1;
export const PASSWORD_MIN_UPPER_CASE = 1;
export const PASSWORD_MIN_NUMBERS = 1;
export const PASSWORD_MIN_SYMBOLS = 1;
export const TITLE_MAX_LENGTH = 200;
export const BODY_MAX_LENGTH = 5e3;
