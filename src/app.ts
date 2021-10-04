// Call Config *
import {configuration} from "./configurations";

// Express Configurations
import express from "express";
const app = express();

// BodyParser Configurations
import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

import {whatsappRouter} from './api/routes';

app.use('/whatsapp/', whatsappRouter);

// Listen The App
app.listen(configuration.app.port, () => {
    console.log(`App Running On Port ${configuration.app.port}`);
});

// For Testing
module.exports = app;