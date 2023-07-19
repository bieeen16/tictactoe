import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose'
import routes from '../src/routes/routes.js'

const app = express();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors());

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
  app.use(express.json());

 
  app.use('/', routes);

app.listen(PORT, () => console.log(`server is running in! ${PORT}`))
