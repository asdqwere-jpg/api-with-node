// Access Environment Variables *
require(`dotenv`).config();

export const message = {
    
    // Error Messages
    messageSystem : {
        success : "SUCCESS"
    },

    errorMessagesSystem : {
        InternalServerError: "INTERNAL_SERVER_ERROR",
        InvalidRequest:      "INVALID_REQUEST",
        InvalidInput:        "INVALID_INPUT",
        Timeout:             "TIMEOUT",
    }
};