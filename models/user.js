const {createHmac, randomBytes} = require('crypto');
const { createTokenForUser } = require('../services/authentication');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

userSchema.pre('save', function(next){
    const user = this;

    if(!user.isModified('password')){
        return;
    }

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
    
    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static('matchPasswordAndGenerateToken',
 async function(email, password){
    const user = await User.findOne({email});
    if(!user){
        throw new Error('User not found!');
    }

    const salt = user.salt;
    const hashedPassword = user.password;

    // here the user salt will be used
    const userProvidedHashed = createHmac('sha256', salt).update(password).digest('hex');
    
    if(hashedPassword != userProvidedHashed){
        throw new Error('Incorrect Password!');
    }
    const token = createTokenForUser(user);
    return token;
    
 })


const User = mongoose.model('User', userSchema);
module.exports = User;