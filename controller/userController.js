const userSchema = require('../model/userModel'); // Import the user model
const bcrypt = require('bcrypt')// Import bcrypt for password hashing
const saltRounds = 10; // Define the number of salt rounds for bcrypt

// Function to register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Destructure name, email, and password from request body

        const user = await userSchema.findOne({ email }); // Check if user already exists

        if (user) {
            req.session.message = 'User already exists';
            return res.status(400).redirect('/user') // If user exists, render login page with message
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the password

        const newUser = await userSchema({
            name,
            email,
            password: hashedPassword, // Create new user with hashed password
        });

        await newUser.save(); // Save the new user to the database
       req.session.message = 'User created successfully';
       res.redirect('/user');
    } catch (error) {
        res.status(500).send('Server error'); // Send server error response
        console.log(error); // Log the error
    }
}

// Function to handle user login
const login = async (req,res) => {
   try {
    const { email, password } = req.body;
    console.log(email);
      const user = await userSchema.findOne({ email });
      console.log(user);
      if (!user)
           return res.status(400).redirect('/user/wrongUser');
      console.log(user);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) 
          return res.status(400).redirect('/user/wrongUser');
      
      req.session.user = email; 
      const users = await userSchema.findOne({email});
      res.redirect('/user');
   } catch (error) {
    consle.log(error)
   }
}

// Function to load the login page
const loadlogin = (req, res) => {
   try {
    const mess = req.session.message;
    res.render('user/login', { message: mess || '' }); // Render login page with message
   } catch (error) {
    console.log(error);
   }
}

// Function to load the home page
const loadHome = async (req, res) => {
    const email = req.session.user; // Get email from session
    const users = await userSchema.findOne({ email }); // Find user by email
    console.log(users);
                      
    res.redirect('/user/login')// Render home page with user's name
}

// Function to handle user logout 
const logout = (req, res) => {  
    req.session.user = false;
    res.redirect('/user/login'); // Redirect to login page
    
}

// Function to handle wrong user credentials
const wrongUser = (req, res) => {
    req.session.message = 'Wrong user credentials'; // Set message in session
    return res.redirect('/user/login'); // Redirect to login page
}

const loadForget = (req, res) => {
    res.render('user/newp');
}

const forget = async(req,res) => {
    const {email,password} = req.body;
    console.log(email);
    const hashedPassword = await bcrypt.hash(password , 10);

    const user = await userSchema.findOne({email});

    if(!user)
      res.render(`user/login`,{message:'User not found'})

   await userSchema.findOneAndUpdate({email},{$set:{
    password:hashedPassword,
   }});
   
   req.session.message = 'Password Chaged Successfully';
   res.redirect('/user/login');   
}

const cancel = async (req,res) => {
    res.redirect('/');
}
// Export all functions 
module.exports = {
    registerUser,
    loadlogin,
    login,
    loadHome,
    logout,
    wrongUser,
    forget,
    loadForget,
    cancel,
}; 