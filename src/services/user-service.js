const { StatusCodes } = require('http-status-codes')
const {UserRepository}=require('../repostiories')
const { AppError } = require("../utils/errors/app-error")
const {Auth}=require('../utils/common')

const userRepository=new UserRepository()

const createUser=async (data) => {
    try{
        const user=await userRepository.create(data)
        return user
    }
    catch(error){
        if(error.name=='TypeError'){            
            throw new AppError('Cannot create a new user object',StatusCodes.INTERNAL_SERVER_ERROR)
        }
        else if(error.name=='SequelizeValidationError' || error.name=='SequelizeUniqueConstraintError'){    
            let explanation=[]
            error.errors.forEach(element => {
                explanation.push(element.message)
            });
            throw new AppError(explanation,StatusCodes.BAD_REQUEST)
        }
        throw error
    }
}

const signIn=async(data)=>{
    try {
        const user=await userRepository.getUserByEmail(data.email)
        if(!user){
            throw new AppError('Invalid email',StatusCodes.BAD_REQUEST)
        }
        const comparePassword=await Auth.validatePassword(data.password,user.password)
        if(!comparePassword)
            throw new AppError('Invalid Password',StatusCodes.BAD_REQUEST)
        const jwt=Auth.createToken({id:user.id,email:user.email})
        return jwt
    } catch (error) {
        throw new AppError('Something went wrong',StatusCodes.INTERNAL_SERVER_ERROR)
    }
}

const isAuthenticated=async(token)=>{
    try {
        if(!token){
            throw new AppError(`Missing JWT token`,StatusCodes.BAD_REQUEST)
        }
        const response=await Auth.verifyToken(token)
        const user=await userRepository.get(response.id)
        if(!user)
            throw new AppError(`No user found`,StatusCodes.BAD_REQUEST)
        return user.id
    } catch (error) {
        if(error.name=='JsonWebTokenError')
            throw new AppError(`Invalid JWT token`,StatusCodes.BAD_REQUEST)
        if(error.name=='TokenExpiredError')
            throw new AppError(`JWT token Expired`,StatusCodes.BAD_REQUEST)
        console.log(error);
        throw error
    }
}

module.exports={
    createUser,
    signIn,
    isAuthenticated
}