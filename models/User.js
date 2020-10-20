const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],

    },
    email: {
        type: String,
        unique: true, // Cannot do custom error as below
        required: [true, 'Email is required'],
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']

    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Passowrd must be 6 character or more']
    }
});

// fire a function before doc saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcypt.genSalt()
    this.password = await bcypt.hash(this.password, salt)
    next()
})


// fire a function after doc saved to db
userSchema.post('save', function (doc, next) {
    console.log('New user added', doc);
    //Important call next
    next();
})


//static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email})
    if (user){
        const auth = await bcypt.compare(password, user.password)
        if (auth) {
            return user;
        }
        throw Error('Incorrect Password')
    }
    throw Error('User 404')
}

const User = mongoose.model('user', userSchema);

module.exports = User;