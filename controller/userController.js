const model = require('../model/userModel')
const User = model.User
exports.createUser = async(req,res)=>{
const{name,email,password} = req.body;
const users = await User.create({name,email,password})
res.json({
statusCode: 201,
data: users,
message: 'User created successfully',
success: true
})
}

exports.getUsers = async (req,res)=>{
const users = await User.find().exec()
res.json({
statusCode: 200,
data: users,
message: 'Users fetched successfully',
success: true
})

}
exports.getUser = async (req,res)=>{
  const users = await User.findOne({email:req.params.email})
  res.json({
    statusCode: 200,
    data: users,
    message: 'user find successfully',
    success: true
  })
}

exports.updateUser = async (req,res)=>{
  const users = await User.findOneAndUpdate({_id:req.params.id},{name:req.body.name},{new:true})
  res.json({
    statusCode: 200,
    data: users,
    message: 'user updated successfully',
    success: true
  })
}

exports.deleteUser = async (req,res)=>{
  const users = await User.findOneAndDelete({_id:req.params.id})
  res.json({
    statusCode: 200,
    data: users,
    message: 'user deleted successfully',
    success: true
  })
}
