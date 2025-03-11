const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.id +
      '" title="See our inventory of ' +
      row.name +
      ' vehicles">' +
      row.name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.id 
        + '" title="View ' + vehicle.make + ' '+ vehicle.model 
        + 'details"><img src="' + vehicle.thumbnail 
        +'" alt="Image of '+ vehicle.make + ' ' + vehicle.model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.id +'" title="View ' 
        + vehicle.make + ' ' + vehicle.model + ' details">' 
        + vehicle.make + ' ' + vehicle.model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

Util.buildVehiclePage = async function(data){
  let vehicle = data
  let page = '<p class="price">$' + new Intl.NumberFormat('en-US').format(vehicle.price) + '</p>'
  page += '<img src="' + vehicle.image + '" alt="Image of ' + vehicle.make + ' ' + vehicle.model + ' on CSE Motors" />'
  page += '<p>' + vehicle.description + '</p>'
  page += '<ul>'
  page += '<li><strong>Color:</strong> ' + vehicle.color + '</li>'
  page += '<li><strong>Year:</strong> ' + vehicle.year + '</li>'
  page += '<li><strong>Mileage:</strong> ' + vehicle.miles + '</li>'
  page += '</ul>'
  return page
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.id + '"'
    if (
      classification_id != null &&
      row.id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

  /* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

Util.buildPurchasesGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      console.log("vehicle: " + vehicle)
      grid += '<li>'
      grid +=  "You owe: $" + new Intl.NumberFormat('en-US').format(vehicle.price - vehicle.downpayment)
      grid += ' on your purchase of a ' + vehicle.make + ' ' + vehicle.model + ' on ' + new Date(vehicle.purchasedate).toLocaleDateString()
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
 
module.exports = Util