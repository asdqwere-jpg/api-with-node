// Access Environment Variables *
require(`dotenv`).config();

export const app = {

    // Expired Minute
    expiredInMinutes: parseInt(process.env.OTP_EXPIRED_IN_MINUTES || "0") || 5,

    // Application port
    port: process.env.PORT || '3100',
    
};