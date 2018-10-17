const express = require('express');
const mongoose = require('mongoose');

const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');
const users = require('./routes/api/users');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Server config
app.use('api/posts', posts);
app.use('api/profile', profile);
app.use('api/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server on port ${port}`));
