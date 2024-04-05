const mongoose = require('mongoose');
const{Schema} = mongoose
const subjectSchema = new Schema({
    subjectName:{type: String, required: true},
    assignedTeacher:[{type:Schema.Types.ObjectId, ref:'teachers'}],
    days:[{type:String, required:true}],
    classes:[{type:Number, enum:[1,2,3,4,5,6,7,8,9,10]}]
})
exports.Subject = mongoose.model('subjects', subjectSchema)