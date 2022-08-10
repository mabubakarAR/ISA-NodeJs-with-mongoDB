const router = require('express').Router();

const {
    getMovies,
    getMovie, 
    createMovie
} = require('../controllers/movies');

const { protect, authorize } = require('../middleware/auth');

const Movies = require('../models/Movies');

router.route('/').get(getMovies).post(protect, authorize('admin'), createMovie);

router.route('/:id').get(getMovie).put(protect, authorize('admin'));

module.exports = router;