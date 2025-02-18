const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build vehicle page
 * ************************** */
invCont.buildVehiclePage = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const info = await utilities.buildVehiclePage(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle", {
    title: data.year + " " + data.make + " " + data.model,
    nav,
    info,
    errors: null,
  })
}

/* ***************************
 *  Build management page
 * ************************** */
invCont.buildManagementPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

invCont.buildAddClassificationPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

invCont.addClassification = async function (req, res, next) {
  const name = req.body.name
  const result = await invModel.addClassification(name)
  if (result) {
    res.redirect("/inv/management")
  } else {
    res.status(500).send("Error adding classification")
  }
}

invCont.buildAddInventoryPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classifications = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classifications,
    errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {
  const result = await invModel.addInventory(req.body)
  if (result) {
    res.redirect("/inv/management")
  } else {
    res.status(500).send("Error adding classification")
  }
}

module.exports = invCont;