const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
const inventoryValidation = require('../utilities/inventory-validation');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehiclePage));
router.get("/management/classification/add", inventoryValidation.checkAdmin, utilities.handleErrors(invController.buildAddClassificationPage));
router.get("/management/inventory/add", inventoryValidation.checkAdmin, utilities.handleErrors(invController.buildAddInventoryPage));
router.get("/management", inventoryValidation.checkAdmin, utilities.handleErrors(invController.buildManagementPage));
router.get("/getInventory/:classification_id", inventoryValidation.checkAdmin, utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:invId", inventoryValidation.checkAdmin, utilities.handleErrors(invController.buildEditInventoryPage));
router.get("/delete/:invId", inventoryValidation.checkAdmin, utilities.handleErrors(invController.confirmDeleteInventory));
router.get("/purchase-vehicle/:invId", utilities.checkLogin, utilities.handleErrors(invController.buildPurchaseVehicle))
router.get("/view", utilities.checkLogin, utilities.handleErrors(invController.viewPurchases))

router.post("/classification", 
    inventoryValidation.checkAdmin,
    inventoryValidation.classificationRules(),
    inventoryValidation.checkClassificationRules,
    utilities.handleErrors(invController.addClassification)
);

router.post("/inventory", 
    inventoryValidation.checkAdmin,
    inventoryValidation.inventoryRules(),
    inventoryValidation.checkInventoryRules,
    utilities.handleErrors(invController.addInventory)
);

router.post("/update", 
    inventoryValidation.checkAdmin,
    inventoryValidation.inventoryRules(),
    inventoryValidation.checkInventoryRules,
    invController.updateInventory)

router.post("/delete", inventoryValidation.checkAdmin, utilities.handleErrors(invController.deleteInventory));

router.post("/purchase", utilities.checkLogin, utilities.handleErrors(invController.purchaseVehicle));

module.exports = router;