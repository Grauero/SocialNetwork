const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');
const keys = require('./config/keys');
const applyPassportStrategies = require('./config/passport');

const app = express();

// Connect to MongoDB
const dbURI = process.env.NODE_ENV !== 'test' ? keys.mongoURITest : keys.mongoURI;
mongoose.connect(dbURI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

console.log(dbURI);

// Server config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
applyPassportStrategies(passport);

app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/users', users);

const port = process.env.PORT || 80;
const server = app.listen(port, () => console.log(`Server on port ${port}`));

module.exports = server;
