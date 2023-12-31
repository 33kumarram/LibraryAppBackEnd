const mongoose = require('mongoose')

const ConnectDB = async()=>{
    try{
    const connect = await mongoose.connect(process.env.MONGOOSE_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useFindAndModify:true
    })
    console.log(`MongoDB connected : ${connect.connection.host}`);
    } catch(error){
        console.log(`Error : ${error.message}`);
        process.exit()
    }
}

module.exports = ConnectDB