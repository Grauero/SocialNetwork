const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');
const keys = require('./config/keys');
const applyPassportStrategies = require('./config/passport');

const app = express();

// Connect to MongoDB
const dbURI = process.env.NODE_ENV === 'test' ? keys.mongoURITest : keys.mongoURI;
mongoose.connect(dbURI, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Server config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
applyPassportStrategies(passport);

app.use('/api/posts', posts);
app.use('/api/profile', profile);
app.use('/api/users', users);

// Static assets for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} 

const port = process.env.PORT || 80;
const mode = process.env.NODE_ENV === 'test' ? 'test' : 'dev';
console.log(`MODE=${mode}`);
const server = app.listen(port, () => console.log(`Server on port ${port}`));

module.exports = server;
