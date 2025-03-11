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
    vehicle_id,
    info,
    errors: null,
  })
}

/* ***************************
 *  Build management page
 * ************************** */
invCont.buildManagementPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

invCont.buildEditInventoryPage = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getVehicleById(invId)
  let nav = await utilities.getNav()
  let classifications = await utilities.buildClassificationList(data.classification_id)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + data.make + " " + data.model,
    nav,
    classifications,
    errors: null,
    data,
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    id,
    make,
    model,
    description,
    image,
    thumbnail,
    price,
    year,
    miles,
    color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    id,  
    make,
    model,
    description,
    image,
    thumbnail,
    price,
    year,
    miles,
    color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.make + " " + updateResult.model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    id,
    make,
    model,
    year,
    description,
    image,
    thumbnail,
    price,
    miles,
    color,
    classification_id
    })
  }
}

invCont.confirmDeleteInventory = async function (req, res, next) {
  const id = req.params.invId
  const data = await invModel.getVehicleById(id)
  let nav = await utilities.getNav()
  res.render("./inventory/confirm-delete", {
    title: "Confirm Delete",
    nav,
    errors: null,
    data,
  })
}

invCont.deleteInventory = async function (req, res, next) {
  const id = parseInt(req.body.id)
  const itemName = req.body.make + " " + req.body.model
  const result = await invModel.deleteInventory(id)
  if (result) {
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/management")
  } else {
    res.status(500).send("Error deleting inventory")
  }
}

/* ***************************
* Vehicle Purchase Process
* ************************** */
invCont.buildPurchaseVehicle = async function (req, res, next) {
  const vehicle_id = req.params.invId
  const data = await invModel.getVehicleById(vehicle_id)
  const price = (data.price !== null && data.price !== undefined) ?  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data.price) : "0.00"
  let nav = await utilities.getNav()
  res.render("./inventory/purchase", {
    title: "Purchase " + data.make + " " + data.model,
    nav,
    errors: null,
    vehicle_id,
    price,
  })
}

invCont.purchaseVehicle = async function (req, res, next) {
  const vehicle_id = req.body.vehicle_id
  const account_id = res.locals.accountData.id
  const down_payment = req.body.downpayment
  const result = await invModel.recordPurchase(vehicle_id, account_id, down_payment)
  if (result) {
    res.redirect("/")
  } else {
    res.status(500).send("Error purchasing vehicle")
  }
}

invCont.viewPurchases = async function (req, res, next) {
  const account_id = res.locals.accountData.id
  const data = await invModel.getVehiclePurchases(account_id)
  console.log("data: " + data[0])
  const grid = await utilities.buildPurchasesGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/view-purchases", {
    title: "Your Purchases",
    nav,
    grid,
    errors: null,
  })
}

module.exports = invCont;