const {CrudRepository}=require('./crud-repository')
const {User,Role}=require('../models')

class UserRepository extends CrudRepository{
    constructor(){
        super(User)
    }
    async getUserByEmail(email) {
        return await User.findOne({
            where: { email },
            include: [
            {
                model: Role,
                as: 'roles',   // 👈 must match the alias defined in User.associate
                through: { attributes: [] }, // hides User_Roles join table
            },
            ],
        });
    };
}

module.exports=UserRepository