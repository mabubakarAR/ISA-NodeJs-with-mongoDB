const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

//Load Models
const Property = require('./models/Properties');
const Course = require('./models/Course');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  });

// Read JSON files
const properties = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/properties.json`, 'utf-8')
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
  
  
// Import into DB
const importData = async () => {
    try {
        await Property.create(properties);
        await Course.create(courses);
        console.log('Data Imported...'.green.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};

// Delete from DB
const deleteData = async () => {
    try {
        await Property.deleteMany();
        await Course.deleteMany();
        console.log('Data Deleted...'.red.inverse);
        process.exit();
    } catch (err) {
        console.error(err);
    }
};
  
// Import or Export Data
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}