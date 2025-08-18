const { StatusCodes } = require("http-status-codes")
const { ErrorResponse } = require("../utils/common")
const { AppError } = require("../utils/errors/app-error")
const { UserService } = require("../services")
const { ServerConfig } = require('../config');

async function validateCreateRequest(req,res,next){
    if(!req.body || !req.body.email){
        ErrorResponse.message='Something went wrong while creating an booking'
        ErrorResponse.error=new AppError(["email can't be fount correctly"],StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    if(!req.body || !req.body.password){
        ErrorResponse.message='Something went wrong while creating an booking'
        ErrorResponse.error=new AppError(["password can't be fount correctly"],StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    next()
}

function validateAdminKey(req, res, next) {
  const { adminKey } = req.body;
  if (adminKey && adminKey === ServerConfig.ADMIN_KEY) {
    req.isAdmin = true; // mark request as admin
  } else {
    req.isAdmin = false;
  }
  next();
}


async function checkAuth(req,res,next) {
    try {
        const response=await UserService.isAuthenticated(req.cookies.token)
        if(response){
            req.user=response
            next()
        }
    } catch (error) {
        return res.status(StatusCodes.BAD_REQUEST).json(error)
    }
}

async function validateRoleRequest(req,res,next){
    if(!req.body || !req.body.id){
        ErrorResponse.message='Something went wrong while creating an booking'
        ErrorResponse.error=new AppError(["id can't be fount correctly"],StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    if(!req.body || !req.body.role){
        ErrorResponse.message='Something went wrong while creating an booking'
        ErrorResponse.error=new AppError(["role can't be fount correctly"],StatusCodes.BAD_REQUEST)
        return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse)
    }
    next()
}

async function isAdmin(req,res,next) {
    const response=await UserService.isAdmin(req.user)
    if(!response)
        return res.status(StatusCodes.UNAUTHORIZED).json({message:'User is not authorized for this request'})
    next()
}

module.exports={
    validateCreateRequest,
    checkAuth,
    validateRoleRequest,
    isAdmin,
    validateAdminKey
}