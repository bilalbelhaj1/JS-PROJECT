import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import expressLayout from 'express-ejs-layouts';

// Routes
import mainRoute from './server/routes/main.js';
import authRoute from './server/routes/user.js';
import teacherRoute from './server/routes/teacher.js';
import studentRoute from './server/routes/student.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Configurations
const PORT = process.env.PORT || 5000;
const Mongo_CLOUD = 'mongodb+srv://ayoubchaddad:fE0i6ALU14eCmn4K@cluster0.6dimacj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const MONGO_LOCAL = 'mongodb://localhost:27017/examdb';

// Middleware
app.use(express.json()); 
app.use(express.static('public'));
app.use(express.static('assets'));

app.use(cookieParser());
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs'); 

// Routes
app.use('/', mainRoute); 
app.use('/auth', authRoute); 
app.use('/teacher', teacherRoute); 
app.use('/student', studentRoute); 

// Connect to MongoDB and start the server
mongoose.connect(Mongo_CLOUD)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// 404 Not Found handler 
app.use((req, res) => {
    res.status(404).render('notfound404', { layout: false});
});
