const express=require('express')
const router=express.Router()
const {InfoController}=require('../../controllers')
const {UserMiddleware}=require('../../middlewares')
const userRoutes=require('./user-routes')

router.get('/info',UserMiddleware.checkAuth,InfoController.info)

router.use('/users',userRoutes)

module.exports=router