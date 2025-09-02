const mongoose=require('mongoose')

const Connect=process.env.CONNECTION_STRING

mongoose.connect(Connect).then(res=>{
    console.log("db success");
    
}).catch(err=>{
    console.log(err);
    
})