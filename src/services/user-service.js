const { StatusCodes } = require('http-status-codes')
const {UserRepository}=require('../repostiories')
const { AppError } = require("../utils/errors/app-error")

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

module.exports={
    createUser
}