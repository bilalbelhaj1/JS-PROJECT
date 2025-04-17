import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import expressLayout from 'express-ejs-layouts';
import mainRoute from './server/routes/main.js';
import authRoute from './server/routes/user.js';
import teacherRoute from './server/routes/teacher.js';
import studentRoute from './server/routes/student.js'

const app = express();

const PORT = process.env.PORT || 5000;
//const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/examdb';

const MONGO_URL = 'mongodb+srv://bilalbelhadj2025:4sUgd85m6mAr5DCH@platform-exam.itwebls.mongodb.net/?retryWrites=true&w=majority&appName=platform-exam';


app.use(express.json());

app.use(express.static('public'));


app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', mainRoute);
app.use('/auth', authRoute);
app.use('/teacher', teacherRoute);
app.use('/student', studentRoute)

// connect to the local mongodb database and start the server if the connection is successful
mongoose.connect('mongodb://localhost:27017/examdb')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });