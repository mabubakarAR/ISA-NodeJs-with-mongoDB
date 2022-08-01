const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Properties');
const geocoder = require('../utils/geocoder');

// desc      Get all properties
// route     GET /api/v1/properties
// access    Public

exports.getProperties = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = {...req.query};
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(req.query);
  queryStr= queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  query = Property.find(JSON.parse(queryStr))

  // Select Fields
  if(req.query.select){
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  
  // Sort
  if(req.query.sort){
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Property.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const properties = await query;

  //Pagination
  const pagination = {};

  if(endIndex < total){
    pagination.next = {
      page: page+1,
      limit
    }
  }

  if(startIndex > 0){
    pagination.prev = {
      page: page-1,
      limit
    }
  }

  res.status(200).json({
      success: true, 
      count: properties.length,
      pagination,
      message: `All properties found successfully`,
      data: properties
  });
});

// desc      Get single property
// route     GET /api/v1/properties/:id
// access    Public

exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if(!property){
      return next(new ErrorResponse(`Property not found of id ${req.params.id}`, 404));
  }

  res.status(200).json({
      success: true, 
      message: `Property found successfully`,
      data: property
  });
});

// desc      Create new property
// route     POST /api/v1/properties
// access    Private

exports.createProperty = asyncHandler(async (req, res, next) => {
  const properties = await Property.create(req.body);

  res.status(201).json({
      success: true,
      message: "New property added successfully",
      data: properties
  });
});

// desc      Update a property
// route     PUT /api/v1/properties/:id
// access    Private

exports.updateProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findByIdAndUpdate(req.params.id, req.body);

  if(!property){
      return next(new ErrorResponse(`Property not found of id ${req.params.id}`, 404));
  }

  res.status(200).json({
      success: true, 
      message: "Property updated successfully",
      data: property
  })
});

// desc      Delete a property
// route     DELETE /api/v1/properties/:id
// access    Private

exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findByIdAndDelete(req.params.id);

  if(!property){
      return next(new ErrorResponse(`Property not found of id ${req.params.id}`, 404));
  }

  res.status(200).json({
      success: true, 
      message: "Property deleted successfully",
      data: {}
  })
});

// desc      Get properties with in radius
// route     GET /api/v1/properties/radius/:zipcode/:distance
// access    Private

exports.getPropertiesInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const properties = await Property.find({
      location: {
          $geoWithin: { $centerSphere: [[lng, lat], radius] }
      }
  });

  res.status(200).json({
      success: true, 
      count: properties.length,
      data: properties
  })
});

// @desc    Upload photo for property
// @route   PUT /api/v1/properties/:id/photo
// @access  Private
exports.propertiesPhotoUpload = asyncHandler(async (req, res, next) => {
  const numb = req.params.id;

  let propertyReply = await Property.findById(numb);

  if (!propertyReply) {
    return next(
      new ErrorResponse(`Property not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is owner
  // if (
  //   propertyReply.user.toString() !== req.user.id &&
  //   req.user.role !== 'admin'
  // ) {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.user.id} does not have permission to updateProperty ${req.params.id}`,
  //       401
  //     )
  //   );
  // }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file.`, 400));
  }

  //console.log('req.files to see if we received the photo', req.files);

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file.', 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image file less than ${process.env.MAX_FILE_UPLOAD} bytes.`,
        400
      )
    );
  }

  // Create custom filename
  file.name = `photo_${propertyReply._id}${path.parse(file.name).ext}`;

  console.log('file.name------   ', file.name);

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with the file upload.', 500));
    }

    await Property.findByIdAndUpdate(numb, {
      photo: file.name,
    });
  });

  res.status(200).json({
    success: true,
    message: `Successfully updated property photo with ID: ${numb}`,
    data: file.name,
  });
});