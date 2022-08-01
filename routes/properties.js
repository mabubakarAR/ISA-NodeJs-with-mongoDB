const router = require('express').Router();

// Include other resource routers
const courseRouter = require('./courses');
// const reviewRouter = require('./reviews');

// Re-route into other resource routers
router.use('/:propertiesId/courses', courseRouter);
// router.use('/:propertiesId/reviews', reviewRouter);

const {
    getProperties,
    getProperty, 
    createProperty, 
    updateProperty, 
    deleteProperty,
    getPropertiesInRadius,
    propertiesPhotoUpload
} = require('../controllers/properties');


const Properties = require('../models/Properties');

const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(Properties, 'courses'), getProperties).post(createProperty);

router.route('/radius/:zipcode/:distance').get(getPropertiesInRadius);

router.route('/:id').get(getProperty).put(updateProperty).delete(deleteProperty);

router.route(`/:id/photo`).put(propertiesPhotoUpload);

module.exports = router;