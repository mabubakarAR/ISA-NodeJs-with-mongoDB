const router = require('express').Router({ mergeParams: true });

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses');

// const { protect, authorize } = require('../middleware/auth');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'properties',
      select: 'name description',
    }),
    getCourses
  )
  .post(addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
