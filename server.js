const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');


//Load config var
dotenv.config({path: './config/config.env'});

//Connect DB
connectDB();

// Route files
const properties = require('./routes/properties')

const app = express();

// Body parser
app.use(express.json());

//logger with morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Mount Routers
app.use('/api/v1/properties', properties);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold))

//Handle unhandled promise rejections
process.on('undandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});