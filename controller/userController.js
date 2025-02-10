const userSchema = require('../model/userModel'); // Import the user model
const swal = require('sweetalert2'); // Import SweetAlert2 for alerts
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const saltRounds = 10; // Define the number of salt rounds for bcrypt

// Function to register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Destructure name, email, and password from request body

        const user = await userSchema.findOne({ email }); // Check if user already exists

        if (user) {
            return res.status(400).render('user/login', { message: 'User already exists' }); // If user exists, render login page with message
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        const newUser = await userSchema({
            name,
            email,
            password: hashedPassword, // Create new user with hashed password
        });

        await newUser.save(); // Save the new user to the database

        res.redirect(`/user/${message = 'User created successfully'}`); // Redirect to user page with success message
    } catch (error) {
        res.status(400); // Set response status to 400
        console.log(error); // Log the error
    }
}

// Function to handle user login
const login = async (req, res) => {
    try {
        const { email } = req.body; // Destructure email from request body
        return res.redirect(302, `/user/home/${email}`); // Redirect to user home page with email
    } catch (error) {
        console.log(error); // Log the error
        res.status(400); // Set response status to 400
    }
}

// Function to load the login page
const loadlogin = (req, res) => {
    const { message } = req.params; // Destructure message from request params
    res.render('user/login', { message: message }); // Render login page with message
}

// Function to load the home page
const loadHome = async (req, res) => {
    const { email } = req.params; // Destructure email from request params
    const user = await userSchema.findOne({ email }); // Find user by email

    res.render('user/home', { name: user.name }); // Render home page with user's name
}

// Function to handle user logout
const logout = (req, res) => {
    req.session.user = false;
    res.redirect('/'); // Redirect to home page
}

// Function to handle wrong user credentials
const wrongUser = (req, res) => {
    return res.redirect(302, `/user/${message = 'Wrong Credentials'}`); // Redirect to user page with error message
}

// Export all functions
module.exports = {
    registerUser,
    loadlogin,
    login,
    loadHome,
    logout,
    wrongUser,
};