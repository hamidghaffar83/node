const model = require('../model/subjectsModel');
const Response = require('../response');
const subject = model.Subject;
exports.createSubject = async(req, res)=>{
    try{
        const{subjectName,assignedTeacher, classes,days} = req.body;
        const createSubject = await subject.create({subjectName:subjectName})
        await assignedTeacher.map(teacherID=>
            createSubject.assignedTeacher.push(teacherID))
            await classes.map(classes=>
            createSubject.classes.push(classes))
            await days.map(days=>
                createSubject.days.push(days))
                await createSubject.save()
                return new Response(res,200,"Subject Created Successfully", true, createSubject)
    }catch(error){
        return new Response(res,500,"Internal Server error", false, error.message);

    }
}
exports.getAllSubjects = async(req,res)=>{
    try{
        const getAllSubjects = await subject.find().populate({path:'assignedTeacher', model: 'teachers'}).exec()
        return new Response(res,200,"Subject fetched Successfully", true, getAllSubjects)
    }catch(err){
        return new Response(res,500,"Internal Server error", false, error.message);
    }
}