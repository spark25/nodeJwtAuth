const { json } = require('express');
const User = require('../models/User')
const jwt = require('jsonwebtoken')


//Handle Errors
const HandleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' }

    // Duplicate error
    if (err.code === 11000) {
        errors.email = 'Entered email already in use'
        return errors
    }

    // Validation Errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });;
    }

    if(err.message === 'User 404'){
        errors.email = 'User not found'
        return errors
    }
    if(err.message === 'Incorrect Password'){
        errors.password = 'Please check your password'
        return errors
    }

    return errors
}


//create JWT tokens
const maxAge = 3 * 24 * 60 * 60
const createToken = (data) => {
    return jwt.sign(data, 'thingofbeauty', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({ name, email, password })
        const token = createToken({ id: user._id, name: user.name, email: user.email })
        res.cookie('authToken', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = HandleErrors(err);
        res.status(400).json({ errors })
        // res.status(400).send('Error in user creation')
    }
    // res.send('new signup');
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)
        const token = createToken({ id: user._id, name: user.name, email: user.email })
        res.cookie('authToken', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = HandleErrors(err);
        res.status(400).json({ errors })
    }
}