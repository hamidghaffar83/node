const express = require("express");
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const dotenv = require("dotenv")
const teachersRoutes = require('./routes/teachersRoutes');
const studentsRoutes = require('./routes/studentRoutes');
const parentsRoutes = require('./routes/parentsRoutes')
dotenv.config()

const app = express();

min().catch(err => console.log(err));

async function min() {
  await mongoose.connect('mongodb+srv://ghaffarhamid83:7jwDb0ibMcNVAADQ@mongo.0tnpkgp.mongodb.net/SMS?retryWrites=true&w=majority&appName=Mongo')
    .then(() => {
      console.log('Connected to Mongodb');
    })
    .catch(err => {
      console.error('Error connecting to MongoDB:', err);
    });
}

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/teachers', teachersRoutes.router);
app.use('/students', studentsRoutes.router);
app.use('/parents', parentsRoutes.router)

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
