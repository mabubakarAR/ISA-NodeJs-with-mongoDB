const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Movie = require('../models/Movies');

// desc      Get all movies
// route     GET /api/v1/movies
// access    Public

exports.getMovies = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = {...req.query};
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  let queryStr = JSON.stringify(req.query);
  queryStr= queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  query = Movie.find(JSON.parse(queryStr))

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
  const total = await Movie.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const movies = await query;

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
      count: movies.length,
      pagination,
      message: `All movies found successfully`,
      data: movies
  });
});

// desc      Get single movie
// route     GET /api/v1/movies/:id
// access    Public

exports.getMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if(!movie){
    return next(new ErrorResponse(`Movie not found of id ${req.params.id}`, 404));
  }

  res.status(200).json({
      success: true, 
      message: `Movie found successfully`,
      data: movie
  });
});

// desc      Create new movie
// route     POST /api/v1/movies
// access    Private

exports.createMovie = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user =  req.user.id
  const movies = await Movie.create(req.body);

  res.status(201).json({
      success: true,
      message: "New movie added successfully",
      data: movies
  });
});