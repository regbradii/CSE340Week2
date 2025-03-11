const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

router.get("/login", utilities.handleErrors(accountController.buildLogin));
router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountPage));

router.post("/register", 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);
    // Process the login attempt
router.post("/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.post("/updatePersonalInfo", utilities.checkLogin, 
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount));

router.post("/updatePassword", utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword));

router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.logout));

module.exports = router;