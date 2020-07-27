const router = require("express").Router();
const User = require("../models/User");

const passport = require('passport')
router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

router.post("/users/signin", passport.authenticate('local',{
  successRedirect: '/notes',
  failureRedirect:'/users/signin',
  failureFlash:true
}))

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
  const { name, email, password, confirm } = req.body;
  const errors = [];
  if (name.length <= 0) errors.push({ text: "inserta un nombre" });

  if (password != confirm) {
    errors.push({ text: "Password do not match" });
  }
  if (password.length < 4) {
    errors.push({ text: "contraseña corta" });
  }
  if (errors.length > 0) {
    res.render("users/signup", { errors, name, email, password, confirm });
  } else {
    const emailUser = await User.findOne({email: email})
    if(emailUser){
        req.flash('error_msg', 'el email esta en uso')
        res.redirect('users/signup')

    }

    const newUser = new User({ name, email, password });
    newUser.password = await newUser.encryptPassword(password)
    await newUser.save();
    req.flash('success_msg', 'registrado')
    res.redirect('/users/signin')
  }
});

router.get('/users/logout', (req,res)=>{

  req.logout();
  res.redirect('/');
})

module.exports = router;
