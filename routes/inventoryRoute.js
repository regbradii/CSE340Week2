const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const inventoryValidation = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehiclePage));
router.get("/management", utilities.handleErrors(invController.buildManagementPage));
router.get("/management/classification/add", utilities.handleErrors(invController.buildAddClassificationPage));
router.get("/management/inventory/add", utilities.handleErrors(invController.buildAddInventoryPage));

router.post("/classification", 
    inventoryValidation.classificationRules(),
    inventoryValidation.checkClassificationRules,
    utilities.handleErrors(invController.addClassification)
);

router.post("/inventory", 
    inventoryValidation.inventoryRules(),
    inventoryValidation.checkInventoryRules,
    utilities.handleErrors(invController.addInventory)
);
module.exports = router;