const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const override = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

//Init
const app = express()
require('./database')
require('./config/passport')



const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


//settings

app.set('port',process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir:  path.join(app.get('views'),'partials'),
    extname: '.hbs'

}))

app.set('view engine','.hbs')

//midddlewares

app.use(express.urlencoded({extended: false}))
app.use(override('_method'));
app.use(session({

    secret: 'mysecretapp',
    resave:true,
    saveUninitialized:true

}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());




//Global variable

app.use((req,res,next)=>{

res.locals.success_msg = req.flash('success_msg')
res.locals.error_msg = req.flash('error_msg')
res.locals.error = req.flash('error')
res.locals.user = req.user || null

next();

})

//Routes

app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))





//Static files

app.use(express.static(path.join(__dirname,'public')))


//Server  is Listening

app.listen(app.get('port'),()=>{
 
    console.log("Server on port",app.get('port'))


});