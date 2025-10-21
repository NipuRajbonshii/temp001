import dotenv from 'dotenv'
dotenv.config();
import express from 'express';

import logger from "./logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";
const app = express();
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use(express.json())

const teas = [];
let index = 1;

app.post('/tea', (req, res, next) => {
  logger.info("Hello world");
  logger.warn("Errors can occur");
  const { name, price } = req.body;
  const newTea = { id: index++, name, price};
  teas.push(newTea);
  res.status(200).send(newTea);
})

app.get('/teas', (req, res, next) => {
  res.status(200).send(teas);
})

app.get('/tea/:id', (req, res, next) => {
  const homeId = parseInt(req.params.id);
  const tea = teas.find(t => t.id === homeId);
  if(!tea){
    return res.status(404).send("Can't find the tea you are looking for")
  }
  res.status(200).send(tea)
})

app.put('/tea/:id', (req, res, next) => {
   const homeId = parseInt(req.params.id);
  const tea = teas.find(t => t.id === homeId);
  if(!tea){
    return res.status(404).send("Can't find the tea you are looking for")
  }
  const { name, price} = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send(tea);
})

app.delete('/tea/:id', (req, res, next) => {
  const index = parseInt(req.params.id);
  if(index<1 || index > teas.length){
    logger.error("Invalid index!");
    return res.status(404).send('Invalid index!');
  }
  const delTea = teas.splice(index - 1, 1);
  res.status(200).send(delTea[0]);
})

const PORT = process.env.PORT || 3000;
const hostName = '127.0.0.1';

app.listen(PORT, hostName, () => {
  console.log(`Server is running at http://${hostName}:${PORT}`);
})