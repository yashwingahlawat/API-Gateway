const { StatusCodes } = require('http-status-codes')
const {UserRepository,RoleRepository}=require('../repostiories')
const { AppError } = require("../utils/errors/app-error")
const {Auth}=require('../utils/common')
const {Enums}=require('../utils/common')

const {CUSTOMER,ADMIN}=Enums.USER_ROLES_ENUMS
const userRepository=new UserRepository()
const roleRepository=new RoleRepository()

const createUser=async (data,isAdmin) => {
    try{
        const user=await userRepository.create(data)
        const role=await roleRepository.getUserRole(isAdmin?ADMIN:CUSTOMER)
        console.log(user,role);
        await user.addRoles(role)
        return user
    }
    catch(error){
        console.log(error);
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
        const roles = user.roles.map(r => r.name);
        if(!user){
            throw new AppError('Invalid email',StatusCodes.BAD_REQUEST)
        }
        const comparePassword=await Auth.validatePassword(data.password,user.password)
        if(!comparePassword)
            throw new AppError('Invalid Password',StatusCodes.BAD_REQUEST)
        // console.log(userWithRoles);
        const jwt=Auth.createToken({id:user.id,email:user.email,roles})
        return jwt
    } catch (error) {
        console.log(error);
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
        const roleNames = (await user.getRoles()).map(r => r.name);
        if(!user)
            throw new AppError(`No user found`,StatusCodes.BAD_REQUEST)
        if(!roleNames.length)
            throw new AppError(`No role has been assigned to the user`,StatusCodes.BAD_REQUEST)
        return {
            user:user.id,
            roles:roleNames
        }
    } catch (error) {
        if(error.name=='JsonWebTokenError')
            throw new AppError(`Invalid JWT token`,StatusCodes.BAD_REQUEST)
        if(error.name=='TokenExpiredError')
            throw new AppError(`JWT token Expired`,StatusCodes.BAD_REQUEST)
        console.log(error);
        throw error
    }
}

const addRoleToUser=async (data) => {
    try {
        const user=await userRepository.get(data.id)
        const role=await roleRepository.getUserRole(data.role)
        if(!user)
            throw new AppError('Invalid user.',StatusCodes.NOT_FOUND)
        if(!role)
            throw new AppError('Invalid role.',StatusCodes.NOT_FOUND)
        user.addRoles(role)
        return user
    } catch (error) {
        console.log(error);
        throw error
    }
}

const isAdmin=async (id) => {
    try {
        const user=await userRepository.get(id)
         if(!user)
            throw new AppError('Invalid user.',StatusCodes.NOT_FOUND)
        const adminRole=await roleRepository.getUserRole(ADMIN)
        if(!adminRole){
            throw new AppError('Admin role is assigned to the user.',StatusCodes.NOT_FOUND)
        }
        return user.hasRoles(adminRole)
    } catch (error) {
        console.log(error);
        throw error
    }
}

module.exports={
    createUser,
    signIn,
    isAuthenticated,
    addRoleToUser,
    isAdmin
}