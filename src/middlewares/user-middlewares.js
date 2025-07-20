const { StatusCodes } = require("http-status-codes")
const { ErrorResponse } = require("../utils/common")
const { AppError } = require("../utils/errors/app-error")

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

module.exports={
    validateCreateRequest
}