// Call Config *
import {configuration} from "../../configurations/index";

// Call Utils *
import {helper} from "../helpers/index";

// Call Express
import  express, { NextFunction }  from "express";

// Logger Function & Configurations
import { errorLogger } from "../routes";

export const constructor = (req : express.Request, res : express.Response, next : NextFunction) => {

    try{
        // Store The Required Data
        let requiredData = ['otp', 'number', 'iat'];

        // Validate The Data
        let validate = helper.utils.verify(requiredData, req.body);

        if (!validate) {
            res.send(helper.utils.sendOutput(configuration.message.errorMessagesSystem.InvalidInput));
        } else {
            next();
        }
        
    } catch(error : any) {
        errorLogger.log({
            level: 'error',
            message: error
        });
        
        res.send(helper.utils.sendOutput(configuration.message.errorMessagesSystem.InternalServerError));
    }
    
}