const adminModel = require('../model/adminModel'); // Import the admin model
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const userModel = require('../model/userModel'); // Import the user model



// Function to load the login page
const loadLogin = (req, res) => {
    res.render('admin/login'); 
};

// Function to handle login
const login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body; 
        console.log(email, password); 
        
        // Find admin by email (case-insensitive query)
        const admin = await adminModel.findOne({ email});
        console.log(admin);

        if (!admin)
            return res.render('admin/login', { message: 'Invalid credentials' }); // Render login page with error message if admin not found
        
        // Check if the password matches
        const isMatch = password === admin.password ? true : false;
        //await bcrypt.compare(password, admin.password);

        console.log(isMatch);

        // Render login page with error message if password is incorrect
        if (!isMatch)
            return res.render('admin/login', { message: 'Invalid Password' }); 

        req.session.admin = true; 
        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
    }
};

// Function to load the dashboard
const loadDashboard = async (req, res) => {
    try {
        const admin = req.session.admin; 

        // Redirect to admin login if not logged in
        if (!admin)
            return res.redirect('/admin'); 

        // Find all users
        const users = await userModel.find({}); 

       // Render the dashboard with users
        res.render('admin/dashboard', { users }); 
        
    } catch (error) {
        console.log(error); // Log any errors
    }
}

// Function to handle logout
const logout = (req, res) => {
    req.session.admin = false; 
    res.redirect('/admin');
}

// Function to edit a user
const editUser = async (req, res) => {
    try {
        // Extract user details from request body
        const { id, name, email, password } = req.body; 

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); 

        await userModel.findOneAndUpdate({ _id: id }, {
            $set: {
                name, 
                email,
                password: hashedPassword
            }
        }); // Update user details'

         // Set session user to false
        req.session.user = false;
         // Find all users
        const users = await userModel.find({});

        res.render('admin/dashboard', { message: 'User updated successfully', users }); // Render dashboard with success message and users

    } catch (error) {
        if (error.code === 11000) {
            const users = await userModel.find({});
            return res.render('admin/dashboard', { message: 'This Email Already Exists', users }); // Render dashboard with error message if email already exists
        }
        console.log(error); // Log any errors
    }
}

// Function to add a new user
const addUser = async (req, res) => {
    try {
         // Extract user details from request body
        const { name, email, password } = req.body;
        
        // Find user by email
        const user = await userModel.findOne({ email }); 
        console.log(user);
        // user not existing 
        if (!user) {
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10); 

           // Create a new user
            const newUser = new userModel({
                name,
                email,
                password: hashedPassword
            }); 

          // Save the new user
            await newUser.save(); 
        
         // Find all users
            const users = await userModel.find({}); 
        
        // Render dashboard with success message and users
            res.render('admin/dashboard', { message: 'User added successfully', users });
        } else {
            console.log('exist');
            // Render dashboard with error message if email already exists and existing users
            const users = await userModel.find({});
            return res.render('admin/dashboard', { message: 'This Email Already Exists', users });
        }
         
    } catch (error) {
        console.log(error); 
    }
}

// Function to delete a user
const deleteUser = async (req, res) => {    
    try {
        // Extract user ID from request parameters
        const { id } = req.params; 
       
        // Delete user by ID
        await userModel.findByIdAndDelete({ _id: id }); 
       
        // Find all users
        const users = await userModel.find({}); 
        req.session.user = false;
        
        // Render dashboard with success message and users
        res.render('admin/dashboard', { message: 'User deleted successfully', users }); 
    } catch (error) {
        console.log(error);
        res.status(500).send(error); // Send error response
    }
}

// Function to search for a user
const searchUser = async (req, res) => {
    try {
        // Extract search query from request body
        const { search } = req.body; 
        
        if (search === '') {
            const users = await userModel.find({});
            // Render dashboard with error message if search query is empty
            return res.render('admin/dashboard', { message: 'You did not provide any data', users }); 
        }
        
         // Find users by name or email
        const searchUsers = await userModel.find({
            $or: [
                { name: search },
                { email: search }
            ]
        });
      
        if (searchUsers.length === 0) {
            const users = await userModel.find({});
            // Render dashboard with error message if no users found
            return res.render('admin/dashboard', { message: 'User not found', users }); 
        }

        // Render dashboard with found users
        res.render('admin/dashboard', { users: searchUsers }); 

    } catch (error) {
        console.log(error);
    }
}

// Export all functions
module.exports = {
    loadLogin,
    login,
    loadDashboard,
    logout,
    editUser,
    addUser,
    deleteUser,
    searchUser,
}