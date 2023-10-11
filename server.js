const express = require('express');
const routes = require('./routes');
// Importing the connection object
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

// Connection to the database
sequelize.sync({ force: false})
  .then(() => app.listen(PORT, () => console.log('Now listening')));

