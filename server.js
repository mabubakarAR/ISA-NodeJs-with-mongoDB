const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const cookieParse = require('cookie-parser');


//Load config var
dotenv.config({path: './config/config.env'});

//Connect DB
connectDB();

// Route files
const movies = require('./routes/movies');
const auth = require('./routes/auth');

const app = express();

// Body parser
app.use(express.json());

app.use(cookieParse());

//logger with morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}


//Mount Routers
app.use('/api/v1/movies', movies);
app.use('/api/v1/auth', auth);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold))

//Handle unhandled promise rejections
process.on('undandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});