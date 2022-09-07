const base64 = require('base-64')

module.exports = (users)=>(req,res,next)=>{


    
if(!req.headers.authorization){
    next('unAuthorized logIn')
    return
}
const EncodedCredentials = req.headers.authorization.split(' ').pop()
const DecodedCredentials = base64.decode(EncodedCredentials)
const [userName,passWord] = DecodedCredentials.split(':')

users.authenticateBasic(userName,passWord).then((user)=>{
    req.user = user
    next()
}).catch((err)=> next(err))

}


