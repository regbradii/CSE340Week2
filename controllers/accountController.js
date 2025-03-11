const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountsController = {};
/* ****************************************
*  Deliver login view
* *************************************** */
accountsController.buildLogin = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  };

/* ****************************************
*  Deliver registration view
* *************************************** */
accountsController.buildRegister = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  };

/* ****************************************
*  Process Registration
* *************************************** */
accountsController.registerAccount = async function(req, res) {
    let nav = await utilities.getNav()
    const { firstname, lastname, email, password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
      return;
    }

    const regResult = await accountModel.registerAccount(
      firstname,
      lastname,
      email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  };

  /* ****************************************
 *  Process login request
 * ************************************ */
  accountsController.accountLogin = async function(req, res) {
  let nav = await utilities.getNav()
  const { email, password } = req.body
  const accountData = await accountModel.getAccountByEmail(email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    email,
   })
  return
  }
  try {
   if (await bcrypt.compare(password, accountData.password)) {
   delete accountData.password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 };


 /* ****************************************
 *  Account Page Functions
 * ************************************ */
 accountsController.buildAccountPage = async function(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
    res.render("account/index", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  };

accountsController.updateAccount = async function(req, res) {
  let nav = await utilities.getNav()
  const { firstname, lastname, email, id } = req.body
  const accountData = res.locals.accountData
  const updateResult = await accountModel.updateAccount(
    firstname,
    lastname,
    email,
    id
  )
  if (updateResult) {
    //on success update the jwt with the new data
   const updatedAccountData = await accountModel.getAccountByEmail(email)
   delete updatedAccountData.password
   const accessToken = jwt.sign(updatedAccountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
    req.flash("notice", "Account updated.")
    res.status(201).render("account/index", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccountData
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/index", {
      title: "Account Management",
      nav,
      errors: null,
      accountData
    })
  }
}

accountsController.updatePassword = async function(req, res) {
  const { password, id } = req.body
  let hashedPassword = await bcrypt.hashSync(password, 10)
  const updateResult = await accountModel.updatePassword(
    hashedPassword,
    id
  )
  if (updateResult) {
    req.flash("notice", "Password updated.")
    res.status(201).redirect("/account")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).redirect("/account")
  }
}

accountsController.logout = async function(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You are logged out.")
  res.redirect("/")
}
  
module.exports = accountsController;