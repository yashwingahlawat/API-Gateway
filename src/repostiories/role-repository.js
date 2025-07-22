const {CrudRepository}=require('./crud-repository')
const {Role}=require('../models')

class RoleRepository extends CrudRepository{
    constructor(){
        super(Role)
    }
    async getUserRole(name){
        const role=await Role.findOne({where:{name}})
        return role
    }
}

module.exports=RoleRepository