const Users = require('../Models/Users')
const logger = require('../Library/logger')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function createUser(req,res){
    const { userName, userEmail, password} = req.body
    try{
        if (typeof userName === 'undefined' || typeof userEmail === 'undefined' || typeof password === 'undefined' ) {
            logger.error('Bad Request!')
            res.status(400).send({
              success: false,
              message: 'Bad Request!'
            })
        }else{
            await Users.findOne({userName:userName},async (err,usernamedocs)=>{
                if(err){
                    logger.error(err)
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                }else if(usernamedocs!==null){
                    logger.warn("User Name Already exits "+userName)
                    res.status(201).send({
                        success: false,
                        message: 'User Name Already exits'
                    })
                }else{
                    await Users.findOne({userEmail:userEmail},async (err,useremaildocs)=>{
                        if(err){
                            logger.error(err)
                            res.status(502).send({
                                success: false,
                                message: 'DB Error'
                            })
                        }else if(useremaildocs!==null){
                            logger.warn("User Email Already exits "+userName)
                            res.status(201).send({
                                success: false,
                                message: 'User Email Already exits'
                            })
                        }else{
                            const newUser = new Users({
                                userName : userName,
                                userEmail:userEmail,
                                password:password
                             })
                             newUser.save((err,savedocs)=>{
                                if(err){
                                    logger.error(err)
                                    res.status(502).send({
                                        success: false,
                                        message: 'DB Error'
                                    })
                                }else{
                                    logger.info('User created successfully with username    '+userName)
                                        res.status(200).send({
                                            success: true,
                                            message: 'User created successfully'
                                    })
                                }
                             })
                        }
                    })
                }
            })
        }
    }catch(error){
        logger.error(error)
        res.status(500).send({
            success:false,
            message:"Server Problem"
        })
    }
}

async function loginUser(req,res)
{
    const { userName, password} = req.body
    try{
        if (typeof userName === 'undefined'  || typeof password === 'undefined' ) {
            logger.error('Bad Request!')
            res.status(400).send({
              success: false,
              message: 'Bad Request!'
            })
        }else{
            await Users.findOne({userName:userName}, (findError, docs) => {
                if (docs===null) {
                    logger.warn("User does not exists")
                    res.status(201).json({
                        success: false,
                        message: "User does not exists"
                    })
                }else if(findError){
                    logger.error(err)
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                }else {
                    bcrypt.compare(password, docs.password, function (err, result) {
                        if(err){
                            logger.warn('Error during Password Comparion')
                            res.status(201).send({
                                success: false,
                                message: 'Error during Password Comparion'
                            })
                        }else if(result==true){
                            jwt.sign({docs}, 'secretkey', (err, token) => {
                                if(err){
                                    logger.warn('Error during Token  Generation')
                                    res.status(201).send({
                                        success: false,
                                        message: 'Error during Token  Genration'
                                    })
                                }else{
                                    logger.info('User Logged in successfully')
                                    res.status(200).json({
                                        success:true,
                                        userId:docs._id,
                                        message: "Successfully logged in as "+docs.userName+".",
                                        jwttoken : token
                                    });
                                }
                            });
                         }else if(result==false){
                            logger.warn('Password Mismatch')
                                res.status(201).json({
                                    success:false,
                                    message: "Password Mismatch",
                                });
                         }else{
                            logger.warn('Invalid Credentials')
                                res.status(201).json({
                                    success:false,
                                    message: "Invalid Credentials",
                                });
                         }   
                        });
                    }
                })
        }
    }catch(error){
        res.status(500).json({
            success: false,
            message: 'Server Problem'
        })
    }
}

module.exports= {
    createUser,
    loginUser,
}