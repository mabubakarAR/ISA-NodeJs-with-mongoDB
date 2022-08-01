const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Property = require('../models/Properties');

// @desc    Get all courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/properties/:propertiesId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  console.log(req.params)
  if (req.params.propertiesId) {
    const courses = await Course.find({ properties: req.params.propertiesId });

    return res.status(200).json({
      success: true,
      message: 'Retrieved courses.',
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'properties',
    select: 'name description',
  });

  if (!course) {
    return next(
      new ErrorResponse(`No course with id:   ${req.params.id}.`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: 'Retrieved course.',
    data: course,
  });
});

// @desc    Add a single course
// @route   POST /api/v1/properties/:propertiesId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  debugger
  console.log(req.body)
  req.body.properties = req.params.propertiesId;
  req.body.user = req.user.id;

  const properties = await Property.findById(req.params.propertiesId);

  if (!properties) {
    return next(
      new ErrorResponse(`No property with id:   ${req.params.propertiesId}.`, 404)
    );
  }

  // Make sure user is owner
  // if (properties.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} does not have permission to add a course to Property ${req.params.propertiesId}`,
  //       401
  //     )
  //   );
  // }

  const course = await Course.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Course Created.',
    data: course,
  });
});

// @desc    Update a single course
// @route   PUT /api/v1/properties/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  let course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse(`No course with id: ${courseId}.`, 404));
  }

  // Make sure user is course owner
  // if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} does not have permission to update course ${req.params.id}`,
  //       401
  //     )
  //   );
  // }

  course = await Course.findByIdAndUpdate(courseId, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Course Updated.',
    data: course,
  });
});

// @desc    Delete a single course
// @route   DELETE /api/v1/properties/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorResponse(`No course with id:   ${courseId}.`, 404));
  }

  // Make sure user is course owner
  // if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} does not have permission to delete course ${req.params.id}`,
  //       401
  //     )
  //   );
  // }

  const courseDeleted = await course.remove();

  res.status(200).json({
    success: true,
    message: 'Course  Deleted.',
    data: {},
  });
});
