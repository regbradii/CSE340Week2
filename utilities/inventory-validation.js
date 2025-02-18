const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("name")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
        // classification name must be alphanumeric
        .matches(/^[a-zA-Z0-9]+$/) // only letters, numbers
        .withMessage("Classification name does not meet requirements.")
    ]
};

validate.checkClassificationRules = async (req, res, next) => {
    const { name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        name,
      })
      return
    }
    next()
  }

  validate.inventoryRules = () => {
    return [
        body("id")
        .trim()
        .notEmpty()
        .isNumeric()
        .withMessage("Please provide a classification."),
        body("year")
        .trim()
        .notEmpty()
        .isLength({ min: 4, max: 4 })
        .withMessage("Please provide a 4-digit year.")
        .isNumeric()
        .withMessage("Year must be a number."),
        body("make")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."),
        body("model")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a model."),
        body("price")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a price.")
        .isNumeric()
        .withMessage("Price must be a number."),
        body("color")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."),
        body("thumbnail")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a thumbnail."),
        body("image")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide an image."),
        body("miles")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide miles.")
        .isNumeric()
        .withMessage("Miles must be a number."),
        body("description")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a description.")
    ]
};

validate.checkClassificationRules = async (req, res, next) => {
    const { name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        name,
      })
      return
    }
    next()
  }

  validate.checkInventoryRules = async (req, res, next) => {
    const { make, model, year, price, description, image, thumbnail, miles, color, id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        make,
        model,
        year,
        price,
        description,
        image,
        thumbnail,
        miles,
        color,
        id
      })
      return
    }
    next()
  }

module.exports = validate