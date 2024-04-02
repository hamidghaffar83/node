const jwt = require('jsonwebtoken');
const model = require('../model/userModel');
const USER = model.User;
exports.AuthGuard = async(req,res,next)=>{
    const token = req.get('Authorization').split('Bearer')[1];
    try{
        const verify = jwt.verify(token, 'shhhhh');
        if(verify.email){
            console.log(token);
            const user = await USER.findOne({email:verify.email})
            if(user){
                next();
            }
                else{
                    return res.status(401).json({
                        statusCode: 401,
                        message: 'token expired',
                        success: false
                      });
                }
            }
                else{
                    return res.status(401).json({
                        statusCode: 401,
                        message: 'Unauthorized',
                        success: false
                      });
                }
            }
            catch(error){
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Unauthorized',
                    success: false
                  });
            }
        }