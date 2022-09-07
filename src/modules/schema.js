// const { STRING } = require('sequelize');
// const {Sequelize,DataTypes} = require('sequelize')
// const sql = Sequelize('postgres://postgres:0000@localhost:5432/bear1auth')
const jwt = require('jsonwebtoken')
let bcrypt = require('bcrypt');
const SECRET = process.env.SECRET || 'super-secret'
const USERS = (sql,DataTypes)=>{

const UserModel = sql.define('user',{

userName:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true
},
passWord:{
    type:DataTypes.STRING,
    allowNull:false
},
token:{
    type:DataTypes.VIRTUAL,
    get(){
        return jwt.sign({userName:this.userName, passWord:this.passWord},SECRET)
    },
    set(userObj){
        return jwt.sign(userObj,SECRET)
    }
}
});


UserModel.beforeCreate(async (user)=>{

let hash = await bcrypt.hash(user.passWord,10)

user.passWord = hash
})
UserModel.authenticateBasic =async function(userName,passWord){

    const user = await this.findOne({where:{userName}})

    const isValid = await bcrypt.compare(passWord,user.passWord)

    if(isValid){
        return user
    }

    throw new Error('invalid userName!')
}
UserModel.authenticateBearer = async function(token){
    console.log(token);
    console.log(jwt.decode(token));

    const verifiedToken = jwt.verify((token, SECRET))

    const user = await this.findOne({ where: { userName: verifiedToken.userName } });
    // const user  = await this.findOne({where:{userName:verifiedToken.userName}})
    
    if(user){
        return user
    }
    throw new Error('Invalid user')
}
return UserModel
}

module.exports = USERS