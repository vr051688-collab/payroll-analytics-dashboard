const mongoose=require('mongoose');
module.exports=mongoose.model('Employee',new mongoose.Schema({
 name:String,email:String,salary:Number
}));