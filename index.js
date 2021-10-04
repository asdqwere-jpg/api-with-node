import express from "express";
const app = express();

app.get(`/send`, (request : express.Request, response : express.Response) => {
  
  try {
    RMQchannel.publish(configuration.amqp.exchange,
      configuration.amqp.queue, 
      Buffer.from(JSON.stringify(request.body)));

      response.send(utils.sendOutput(configuration.message.messageSystem.success));
  } catch(error) {
    response.send(utils.sendOutput(configuration.message.errorMessagesSystem.InternalServerError));
  }
  
};

app.listen(4000, () => {
  console.log(`App Running On Port 4000`);
})
