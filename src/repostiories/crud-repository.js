const { AppError } = require('../utils/errors/app-error')
const { StatusCodes } = require('http-status-codes')

class CrudRepository{
    constructor(model){
        this.model=model
    }
    async create(data) {
        const user = await this.model.create(data);
        return user; 
    }

    async destroy(data){
        const response=await this.model.destroy({
            where:{
                id:data
            }
        })
        if(!response)
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        return response
    }
    async get(data){
        const response=await this.model.findByPk(data)
        if(!response)
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        return response
    }
    async getAll(){
        const response=await this.model.findAll()
        return response
    }
    async update(id,data){// data ->{col:val, ...}
        const response=await this.model.update(data,{
            where:{
                id:id
            }
        })
        if(!response){
            throw new AppError('Not able to find the resource',StatusCodes.NOT_FOUND)
        }
        return response
    }
}

module.exports={CrudRepository}