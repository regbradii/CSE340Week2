const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav();
  res.render("index", {title: "Home", nav});
}

baseController.buildError = async function(req, res){
    throw new Error("This is a test error")
    }

module.exports = baseController