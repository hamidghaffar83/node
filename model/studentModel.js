const mongoose = require('mongoose');
const { Schema } = mongoose
const StudentsSchema = new Schema ({
    firstName : {type:String, required : true},
    lastName : {type: String,  required : true},
    fatherName: {type: String, required: true},
    motherName: {type: String, required: true},
    fatherOccupation: {type: String, required: true},
    email: {
        type: String, required: true, unique: true, trim: true, index: true, validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    gender:{
        type : String,
        enum : ["male", "female"],
        required : false,
        default : "male"
    },
    profilePic:{
        data: Buffer,
        contentType: String
    },
    phoneNumber:{
        type: String,
        required: true,
        default: '',
    },
    DOB:{type: Date, required:false },
    bloodGroup:{type: String, required:false},
    religion:{type:String, required:false, default: 'Islam'},
    classes: {type:String, required:true},
    address: [String],
    admission:{
        type: Date,
        required: true,
        default: Date.now()
    },
    isStudentActive:{
        type: Boolean,
        required: true,
        default: true
    }
})
exports.Student = mongoose.model('students', StudentsSchema)