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
  console.log('Make: ', vehicle.make, 'Model: ', vehicle.model, 'Year: ', vehicle.year, 'Description: ', vehicle.description, 'Image: ', vehicle.image, 'Thumbnail: ', vehicle.thumbnail, 'Price: ', vehicle.price, 'Miles: ', vehicle.miles, 'Color: ', vehicle.color, 'Classification ID: ', vehicle.id)
  try {
    const sql = "INSERT INTO public.inventory(make, model, year, description, image, thumbnail, price, miles, color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [vehicle.make, vehicle.model, vehicle.year, vehicle.description, vehicle.image, vehicle.thumbnail, vehicle.price, vehicle.miles, vehicle.color, vehicle.id])
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory};