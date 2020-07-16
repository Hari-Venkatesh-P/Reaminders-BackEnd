const Remainder = require('../Models/Remainder')
const mongoose = require('mongoose')


const logger = require('../Library/Logger')

async function addRemainder(req,res){
    const { userId, title, description, date, priority} = req.body
    try{
        if (typeof userId === 'undefined' || typeof title === 'undefined' || typeof description === 'undefined' || typeof date === 'undefined' || typeof priority === 'undefined') {
            logger.error('Bad Request!')
            res.status(400).send({
              success: false,
              message: 'Bad Request!'
            })
        }else{
            await Remainder.findOne({userId:userId},async (err,docs)=>{
                if(err){
                    logger.error(err)
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                }else if(docs===null){
                    temp = []
                    temp.push({title: title,description: description,date: date,priority: priority})
                    const newRemainder = new Remainder({
                        userId : userId,
                        remainders:temp,
                        createdAt:new Date(),
                     })
                     newRemainder.save((err,savedocs)=>{
                        if(err){
                            logger.error(err)
                            res.status(502).send({
                                success: false,
                                message: 'DB Error'
                            })
                        }else{
                            logger.info('Reminder created successfully for user    '+userId)
                                res.status(200).send({
                                    success: true,
                                    message: 'First Reminder created successfully'
                            })
                        }
                     })
                }else{
                    await Remainder.findOne({userId:userId,remainders:{$elemMatch:{title: title,description: description,date: date,priority: priority}}},async (err,remaindersdocs)=>{
                        if(err){
                            logger.error(err)
                            res.status(502).send({
                                success: false,
                                message: 'DB Error'
                            })
                        }else if(remaindersdocs!==null){
                            logger.warn("reminder for the User Already exits")
                            res.status(201).send({
                                success: false,
                                message: 'Attempting duplicate reminder entry.'
                            })
                        }else{
                            docs.remainders.push({title: title,description: description,date: date,priority: priority,createdAt:new Date});
                            await docs.save((err,saveddocs)=>{
                                if(err){
                                    logger.error(err)
                                    res.status(502).send({
                                        success: false,
                                        message: 'DB Error'
                                    })
                                }else{
                                    logger.info('Reminder created successfully for user'+userId)
                                    res.status(200).send({
                                        success: true,
                                        message: 'Reminder created successfully'
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

async function deleteRemainder(req, res) {
    const { userId, remainderId} = req.body
    try {
        if(typeof userId === 'undefined' || typeof remainderId === 'undefined' ){
            logger.error('Bad Request!')
            res.status(400).send({
              success: false,
              message: 'Bad Request!'
            })
        }else{
            await Remainder.update({userId:userId},{ "$pull": { "remainders": { "_id": remainderId } }},async (err,docs)=>{
                console.log(docs)
                if(err){
                    logger.error(err)
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                }else if(docs.nModified===0){
                    logger.warn("No such reminder found")
                            res.status(201).send({
                                success: false,
                                message: 'No such reminder found'
                            })
                }else{
                    logger.info('Reminder deleted successfullyy')
                    res.status(200).send({
                        success: true,
                        message: 'Reminder deleted successfullyy'
                    })
                }
            })
        }
    }catch (error) {
      logger.error(error)
      res.status(500).send({
        success: false,
        message: error
      })
    }
}

async function updateRemainder(req,res)
{
    const { userId,remainderId, title, description, date, priority} = req.body
    try{
        if (typeof userId === 'undefined' || typeof title === 'undefined' || typeof remainderId === 'undefined' ||  typeof description === 'undefined' || typeof date === 'undefined' || typeof priority === 'undefined') {
            logger.error('Bad Request!')
            res.status(400).send({
              success: false,
              message: 'Bad Request!'
            })
        }else{
            Remainder.updateOne({userId:userId,'remainders._id': remainderId},{
                $set: {
                  'remainders.$.title': title,
                  'remainders.$.description':description,
                  'remainders.$.date': date,
                  'remainders.$.priority': priority,
              }},function (err, updatedocs){
                  console.log(updatedocs)
                  if(err){
                    logger.error(err)
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                  }else if(updatedocs.nModified===0){
                    logger.warn("No update made to the reminder")
                            res.status(201).send({
                                success: false,
                                message: 'No update made to the reminder'
                            })
                }else if(updatedocs.nModified===1){
                    logger.info('Reminder updated successfully for user'+userId)
                    res.status(200).send({
                        success: true,
                        message: 'Reminder updated successfully'
                    })
                  }
                });
        }
    }catch(error){
        logger.error(error)
        res.status(500).send({
            success:false,
            message:"Server Problem"
        })
    }
}

async function getRemaindersByUserId(req,res)
{
    const { userId } = req.params
    try{
        if (typeof userId === 'undefined') {
            logger.error('Bad Request!')
            res.status(400).send({
              success: false,
              message: 'Bad Request!'
            })
        }else{
            Remainder.findOne({userId:userId},async function (err, userdocs){
                  if(err){
                    logger.error(err)
                    res.status(502).send({
                        success: false,
                        message: 'DB Error'
                    })
                  }else if(userdocs==null){
                    logger.warn("User not  found")
                            res.status(201).send({
                                success: false,
                                message: 'User not found'
                            })
                }else{
                    Remainder.findOne({userId:userId},async function (err, userremainderdocs){
                        if(err){
                            logger.error(err)
                            res.status(502).send({
                                success: false,
                                message: 'DB Error'
                            })
                          }else{
                            logger.info("User's reminders fetched successfully")
                                    res.status(200).send({
                                        success: true,
                                        message: userremainderdocs
                                })
                        }
                    })
                  }
                });
        }
    }catch(error){
        logger.error(error)
        res.status(500).send({
            success:false,
            message:"Server Problem"
        })
    }
}

module.exports = {
    addRemainder,
    deleteRemainder,
    updateRemainder,
    getRemaindersByUserId,
}