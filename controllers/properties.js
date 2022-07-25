const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Property = require('../models/Properties');

// desc      Get all properties
// route     GET /api/v1/properties
// access    Public

exports.getProperties = asyncHandler(async (req, res, next) => {
    const properties = await Property.find();
    res.status(200).json({
        success: true, 
        count: properties.length,
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