const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {ServerConfig}=require('../../config/')

async function validatePassword(currPassword,realPassword) {
    try {
        const check=await bcrypt.compareSync(currPassword,realPassword)
        return check
    } catch (error) {
        throw error
    }
}

async function createToken(input) {
    try {
        return jwt.sign(input,ServerConfig.JWT_SECRET,{expiresIn:ServerConfig.JWT_EXPIRY})
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function verifyToken(token) {
    try {
        return jwt.verify(token,ServerConfig.JWT_SECRET)
    } catch (error) {
        console.log(error);
        throw error
    }
}

module.exports={
    validatePassword,
    createToken,
    verifyToken
}