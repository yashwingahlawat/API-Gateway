const express=require('express')
const rateLimiter=require('express-rate-limit')
const cookieParser = require('cookie-parser');
const {createProxyMiddleware}=require('http-proxy-middleware')

const {ServerConfig,Logger}=require('./config')

const apiRoutes=require('./routes')

const app=express()

const limiter=rateLimiter({
    windowMs:2*6*1000,
    max:20
})

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use(cookieParser());

app.use(limiter)

app.use('/fightsService',createProxyMiddleware({target:ServerConfig.FLIGHTS_SERVICE,changeOrigin:true}))

app.use('/bookingsService',createProxyMiddleware({target:ServerConfig.BOOKINGS_SERVICE,changeOrigin:true}))

app.use('/api',apiRoutes)

app.listen(ServerConfig.PORT,async()=>{
    console.log(`Server running on ${ServerConfig.PORT}`)
   
    Logger.info(`Successfully started the server`,'root',{})
})