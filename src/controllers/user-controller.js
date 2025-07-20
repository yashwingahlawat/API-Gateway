const { StatusCodes } = require("http-status-codes")
const { UserService } = require("../services")
const { ErrorResponse, SuccessResponse } = require("../utils/common")

const createUser=async(req,res)=>{
    try{
        const user=await UserService.createUser({
            email:req.body.email,
            password:req.body.password
        })
        SuccessResponse.data=user
        return res.status(StatusCodes.CREATED).json(SuccessResponse)
    }
    catch(error){
        ErrorResponse.error=error
        resStatuseCode=error.statusCode?error.statusCode:StatusCodes.INTERNAL_SERVER_ERROR
        return res.status(resStatuseCode).json(ErrorResponse)
    }
}

const loginUser=async (req,res) => {
    try {
        const user=await UserService.signIn({
            email:req.body.email,
            password:req.body.password
        })
        SuccessResponse.data=user
        return res.status(StatusCodes.ACCEPTED).json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error
        resStatuseCode=error.statusCode?error.statusCode:StatusCodes.INTERNAL_SERVER_ERROR
        return res.status(resStatuseCode).json(ErrorResponse)
    }
}

module.exports={
    createUser,
    loginUser
}