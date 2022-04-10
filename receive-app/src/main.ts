import express, { Request, Response } from "express";
import RabbitmqServer from "./rabbitmq-server";

const app = express();

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  try {
    const messages = [];
    const rabbitmqServer = new RabbitmqServer(
      "amqp://admin:admin@localhost:5672"
    );
    await rabbitmqServer.start();
    await rabbitmqServer.consume("default", (message) =>
      messages.push(message.content.toString())
    );
    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).send("something goes wrong");
  }
});

app.listen(3001, () => console.log("server runnig on port 3001"));
