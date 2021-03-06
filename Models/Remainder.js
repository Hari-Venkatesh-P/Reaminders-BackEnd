const mongoose = require('mongoose')

const RemainderSchema = mongoose.Schema({
    userId:{
        type:String,
    },
    remainders:[{
        title: {
            type: String,
          },
          description:{
              type: String,
          },
          date: {
              type: String,
          },
          priority: {
              type: String,
          },
          createdAt : {
              type: Date,
              default:new Date(),
          }
    }]
  })

module.exports = mongoose.model('RemainderDetails', RemainderSchema);