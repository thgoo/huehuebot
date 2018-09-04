import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
