const mongoose = require('mongoose');
const{Schema} = mongoose
const classeSchema = new Schema({
    className:{type: String, required: true},
    assignedTeacher:[{type:Schema.Types.ObjectId, ref:'teachers'}],
    sections:[{type:String, enum:["A","B","C"],required:true}]
})
exports.Classes = mongoose.model('classes', classeSchema)