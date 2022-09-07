const express = require('express')
require('dotenv').config()

const server = express()
server.use(express.json());
const {Sequelize,DataTypes} = require('sequelize')

const USERS = require('./modules/schema')
const basicAuth = require('./middleware/basic')
const bearerAuth = require('./middleware/bearer')
const sql = new Sequelize('postgres://postgres:0000@localhost:5432/bearer_auth')

const User = USERS(sql,DataTypes)

server.post('/signUp',async (req,res)=>{

    console.log(req.body);

const data = await User.create({
    userName: req.body.userName,
    passWord:req.body.passWord
})
    res.json(data)
    // User.create(req.body).then(user => res.status(201).send(user)).catch(err=> console.log(err))
})

server.post('/signIn',basicAuth(User), (req,res)=>{
    res.status(200).send(req.user)
})

server.get('/GetUser',bearerAuth(User),GetUserFn)

server.get('/',(req,res)=> {
    res.status(200).send('<h2>on the right track!</h2>')
})


function GetUserFn(req,res){
    res.status(200).send(req.userName)
}


// server.listen(PORT,()=> console.log(`Running on port ${PORT}`))



module.exports = {sql,server}