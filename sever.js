const express = require('express');
const app = express();
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const hbs = require('hbs');
const connectDB = require('./db/connectDB');
const session = require('express-session');
const nocache = require('nocache');

 
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
}))

app.use(nocache());

app.set('view engine','hbs');
app.use(express.static('public')); 

app.use(express.urlencoded({extended:true})); 
app.use(express.json());

app.use('/admin',adminRouter); 
app.use('/user',userRouter);
app.use('/',userRouter); 

app.use('*',(req,res) => {
    res.redirect('/user');
})




 
connectDB();  

const port = process.env.port || 3000 ; 

app.listen(port , () => {
    console.log('===================================');
    console.log(`  Server is running on port ${port}`); 
    console.log('===================================');
}) 