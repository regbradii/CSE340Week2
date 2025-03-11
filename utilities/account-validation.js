const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")


const sharedRules = [ 
  // password is required and must be strong password
  body("password")
  .trim()
  .notEmpty()
  .isStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage("Password does not meet requirements."),
] 

const nameRules = [
  // firstname is required and must be string
  body("firstname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 1 })
  .withMessage("Please provide a first name."), // on error this message is sent.

// lastname is required and must be string
body("lastname")
  .trim()
  .escape()
  .notEmpty()
  .isLength({ min: 2 })
  .withMessage("Please provide a last name.") // on error this message is sent.
]
/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
      ...nameRules,
      body("email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (email) => {
          const emailExists = await accountModel.checkExistingEmail(email)
          if (emailExists){
              throw new Error("Email exists. Please log in or use different email")
          }
        }),
      // shared rules
      ...sharedRules
    ]
  }

  /*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
validate.updateRules = () => {
  return [
    ...nameRules,
      body("email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (email, { req }) => {
          const id = parseInt(req.body.id, 10);
          const emailExists = await accountModel.checkExistingEmail(email, id)
          if (emailExists){
              throw new Error("Email exists. Please log in or use different email")
          }
        })
  ]
}

validate.passwordRules = () => {
  return sharedRules
}

  /*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),
    // shared rules
    ...sharedRules
  ]
}

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { firstname, lastname, email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        firstname,
        lastname,
        email,
      })
      return
    }
    next()
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { email, password } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      email,
      password
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  const { firstname, lastname, email, password, id  } = req.body
  let accountData = {
    firstname,
    lastname,
    email,
    password,
    id
  }
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/index", {
      title: "Account Management",
      nav,
      errors: errors,
      accountData
    })
    return
  }
  next()
}

validate.checkPasswordData = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  const { password, id  } = req.body
  let accountData = {
    password,
    id
  }
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/index", {
      title: "Account Management",
      nav,
      errors: errors,
      accountData
    })
    return
  }
  next()
}
  
  module.exports = validate