const express = require('express');
const {getProperties, getProperty, createProperty, updateProperty, deleteProperty} = require('../controllers/properties');

const router = express.Router();

router.route('/').get(getProperties).post(createProperty);

router.route('/:id').get(getProperty).put(updateProperty).delete(deleteProperty);

module.exports = router;