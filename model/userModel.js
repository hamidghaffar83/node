const mongoose = require('mongoose')
const{Schema} = mongoose
const userSchema = new Schema({
name: {
type:String,
required: true,
default: ''
}
,
email: {
type: String,
required: true,
unique: true,
trim: true,
index: true,
},
password:{
type: String,
required:true,
},
isEmailVerified:{
    type: Boolean, required: true, default: false
},
otp:{
    type:String
}
})



exports.User = mongoose.model('Users',userSchema)