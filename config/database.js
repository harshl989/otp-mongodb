const  mongoose = require('mongoose')

require('dotenv').config()

exports.connect = () => {
    console.log(process.env.MONGODB_URL)
    mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology : true
    }).then(()=>console.log("DB Connected Successfully✅"))
    .catch((error)=>{ 
        console.log("this error occured"+ error)
        process.exit(1)
    })
}