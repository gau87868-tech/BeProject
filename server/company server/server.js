const dotenv = require("dotenv");
dotenv.config({path : "./config.env"});
const mongoose = require("mongoose");
const app = require("./app");

mongoose.connect(process.env.MONGODB_URL)
.then(()=>{console.log("Connection Established")})
.catch((err)=>{console.log(err)})


const port = process.env.PORT;
app.listen(port,()=>{
    console.log("Server Listening on Port : "+port)
})