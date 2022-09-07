
const {sql,server} = require('./src/server')
const PORT = process.env.PORT || 3005

sql.sync().then(() => {
    server.listen(PORT, ()=> console.log(`Running on port ${PORT}`))
}).catch(err=> console.log(err))