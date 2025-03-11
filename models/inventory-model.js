const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT i.*, c.name classification FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

async function getVehicleById(vehicle_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      WHERE i.id = $1`,
      [vehicle_id]
    )
    return data.rows[0]
  }
  catch (error) {
    console.error("getVehicleById error " + error)
  }
}

async function addClassification(classification){
  try {
    const sql = "INSERT INTO public.classification (name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification])
  } catch (error) {
    return error.message
  }
}

async function addInventory(vehicle){
  try {
    const sql = "INSERT INTO public.inventory(make, model, year, description, image, thumbnail, price, miles, color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [vehicle.make, vehicle.model, vehicle.year, vehicle.description, vehicle.image, vehicle.thumbnail, vehicle.price, vehicle.miles, vehicle.color, vehicle.id])
  } catch (error) {
    return error.message
  }
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET make = $1, model = $2, description = $3, image = $4, thumbnail = $5, price = $6, year = $7, miles = $8, color = $9, classification_id = $10 WHERE id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function deleteInventory(id){
  try {
    const sql = "DELETE FROM public.inventory WHERE id = $1"
    return await pool.query(sql, [id])
  } catch (error) {
    return error.message
  }
}

async function recordPurchase(vehicle_id, account_id, down_payment) {
  console.log("vehicle_id: " + vehicle_id)
  console.log("account_id: " + account_id)
  console.log("down_payment: " + down_payment)
  try {
    const sql = "INSERT INTO public.purchase (inventoryid, accountid, downpayment) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [vehicle_id, account_id, down_payment])
  } catch (error) {
    return error.message
  }
}

async function getVehiclePurchases(account_id){
  try {
    const
    sql = "SELECT * FROM public.purchase p JOIN public.inventory i on p.inventoryid = i.id Where p.accountid = $1"
    const data = await pool.query(sql, [account_id])
    return data.rows
  }
  catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventory, recordPurchase, getVehiclePurchases};