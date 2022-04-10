import express, { Request, Response } from "express";
import RabbitmqServer from "./rabbitmq-server";

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.send("publish app");
});

app.get("/publish/:message", async (req: Request, res: Response) => {
  try {
    const rabbitmqServer = new RabbitmqServer(
      "amqp://admin:admin@localhost:5672"
    );
    await rabbitmqServer.start();
    await rabbitmqServer.publishInQueue("default", req.params.message);
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).send("something goes wrong");
  }
});

app.listen(3000, () => console.log("server runnig on port 3000"));
