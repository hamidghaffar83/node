const model = require('../model/classesModel');
const Response = require('../response');
const Classes = model.Classes;
exports.createClass = async(req, res)=>{
    try{
        const{className,assignedTeacher, sections} = req.body;
        const createClass = await Classes()

        createClass.className = className
        await assignedTeacher.map(teacherID=>
            createClass.assignedTeacher.push(teacherID))
            await sections.map(sections=>
                createClass.sections.push(sections))
                await createClass.save()
                return new Response(res,200,"Class registered Successfully", true, createClass)
    }catch(error){
        return new Response(res,500,"Internal Server error", false, error.message);

    }
}
exports.getAllClasses = async(req,res)=>{
    try{
        const getAllSubjects = await Classes.find().populate({path:'assignedTeacher', model: 'teachers'}).exec()
        return new Response(res,200,"Class fetched Successfully", true, getAllSubjects)
    }catch(err){
        return new Response(res,500,"Internal Server error", false, error.message);
    }
}