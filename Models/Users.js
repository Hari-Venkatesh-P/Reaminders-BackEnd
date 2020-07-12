const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    userName:{
        type:String,
    },
    userEmail:{
        type:String,
    },
    password:{
        type:String,
    },
  })

UserSchema.pre("save", function(next) {
   if(!this.isModified("password")) {
       return next();
   }
   this.password = bcrypt.hashSync(this.password, 10);
   next();
});

module.exports = mongoose.model('UserDetails', UserSchema);