// Read File Function
import fs from "fs";

// Whatsapp Messaging Service
import { WAConnection, MessageType } from "@adiwajshing/baileys";

// RabbitMQ Library *
import amqp from "amqplib/callback_api";

// Call Utils *
import {helper} from "../helpers/";

// Call Config *
import {configuration} from "../../configurations";

// Express Configurations
import express from "express";
const router = express.Router();


// Logger Function & Configurations
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: 'errors.log', options : {flags : 'w'}})
    ]
});
export const errorLogger = logger;

let RMQchannel : amqp.Channel;

try {

    // Connect To RabbitMQ Server
    amqp.connect(`amqp://${configuration.amqp.username}:${configuration.amqp.password}@${configuration.amqp.host}:${configuration.amqp.port}`, (error0: any, connection: amqp.Connection) => {
        if (error0) {
            logger.log({
                level: 'error',
                message: error0
            });
        } else {
            connection.createChannel((error1: any, channel: amqp.Channel) => {
                if (error1) {
                    logger.log({
                        level: 'error',
                        message: error1
                    });
                } else {

                    RMQchannel = channel;

                    channel.assertQueue(configuration.amqp.queue, {
                        durable: true
                    });

                    // // Check Or Create The Exchange
                    channel.assertExchange(configuration.amqp.exchange, `fanout`, {
                        durable: false
                    });
                    channel.bindQueue(configuration.amqp.queue, configuration.amqp.exchange, '');
                    channel.prefetch(1);

                    // Whatsapp Send Text API
                    channel.consume(configuration.amqp.queue, (whatsappData: amqp.Message | null) => {

                        async function connectToWhatsApp() {
                        let conn = new WAConnection();
                        let auth = false;

                        // Check The File Existence
                        if (fs.existsSync('./wa-auth.json')) {

                            // Read The File
                            fs.readFile('./wa-auth.json', (err : any, data : Buffer) => {
                                if (err) {
                                    logger.log({
                                        level: 'error',
                                        message: err
                                    });
                                } else {
                                    // Check File Size
                                    if (data.length !== 0) {
                                        auth = true;

                                        // Load The Session
                                        conn.loadAuthInfo('./wa-auth.json');
                                    }
                                }
                            });
                        }

                        // On Open Whatsaap Event
                        conn.on('open', async () => {

                            // Store Input From API
                            let dataRecipient = JSON.parse(whatsappData!.content.toString());

                            // Validate The Time
                            if (dataRecipient.iat + (configuration.app.expiredInMinutes * 60) >= helper.utils.getUnix()) {

                                // Send The Message
                                await conn.sendMessage(`${dataRecipient.number}@s.whatsapp.net`, `Ini adalah kode rahasia untuk masuk ke WargaTop dan berlaku selama 5 menit. JANGAN BAGIKAN KODE INI KE SIAPAPUN, termasuk ke WargaTop itu sendiri. Kode : ${dataRecipient.otp}`, MessageType.text);
                            } 

                            // Store The Session If Not Stored In The File Yet
                            if(!auth) {
                                const authInfo = conn.base64EncodedAuthInfo();
                                fs.writeFileSync('./wa-auth.json', JSON.stringify(authInfo, null, '\t'));
                            }
                        })

                        await conn.connect()
                    }

                    connectToWhatsApp()
                        .catch((err : any) => {
                            if (err.status === 401) {
                                logger.log({
                                    level: 'error',
                                    message: "WA Has Been Logged Out, Please Delete The 'wa-auth.json' File And Login Back"
                                });
                            } else {
                                logger.log({
                                    level: 'error',
                                    message: err
                                });
                            }
                        });

                        channel.ack(whatsappData!);

                    });
                }

            });
        }
        
    });
} catch(error : any) {
    logger.log({
        level: 'error',
        message: error
    });
}

// Send Otp Message
router.post(`/send-otp`, (request : express.Request, response : express.Response) => {
    
    try {

        RMQchannel.sendToQueue(configuration.amqp.queue, Buffer.from(JSON.stringify(request.body)));
        response.send(helper.utils.sendOutput(configuration.message.messageSystem.success));

    } catch(error) {
        response.send(helper.utils.sendOutput(configuration.message.errorMessagesSystem.InternalServerError));
    }

});

export const whatsappRouter = router;