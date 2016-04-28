'use strict';

const express = require('express');
const app = express();
const logger = require('morgan');

app.use(logger('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({ SUCCESS: true });
});

const server = app.listen(process.env.PORT || 8000, () => {
  const port = server.address().port;
  console.log('Server running on', port);
});
