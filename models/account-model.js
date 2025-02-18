const { check } = require("express-validator")
const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(firstname, lastname, email, password){
    try {
      const sql = "INSERT INTO account (firstname, lastname, email, password, type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [firstname, lastname, email, password])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(email){
    try {
      const sql = "SELECT * FROM account WHERE email = $1"
      const emailReturn = await pool.query(sql, [email])
      return emailReturn.rowCount
    } catch (error) {
      return error.message
    }
  }

  module.exports = {registerAccount, checkExistingEmail};