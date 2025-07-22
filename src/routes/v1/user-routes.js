const express=require('express')
const { UserController } = require('../../controllers')
const { UserMiddleware } = require('../../middlewares')
const router=express.Router()

router.post('/signup',UserMiddleware.validateCreateRequest,UserController.createUser)

router.post('/signin',UserMiddleware.validateCreateRequest,UserController.loginUser)

router.post('/role',UserMiddleware.validateRoleRequest,UserController.addRoleToUser)

module.exports=router