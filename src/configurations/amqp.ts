// Access Environment Variables *
require(`dotenv`).config();

export const amqp = {

    // Message broker config
    host: process.env.AMQP_HOST || 'localhost',
    username: process.env.AMQP_USER || 'guest',
    password: process.env.AMQP_PASS || 'guest',
    port: process.env.AMQP_PORT || '5672',

    // Queue Name
    queue : "whatsapp-event",

    // Exchange Name
    exchange : "whatsapp-send-otp",

};