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

async function updateAccount(firstname, lastname, email, password, id){
  try {
    const sql = "UPDATE account SET firstname = $1, lastname = $2, email = $3 WHERE id = $5"
    return await pool.query(sql, [firstname, lastname, email, password, id])
  } catch (error) {
    return error.message
  }
}

async function updatePassword(password, id){
  try {
    const sql = "UPDATE account SET password = $1 WHERE id = $2"
    return await pool.query(sql, [password, id])
  } catch (error) {
    return error.message
  }
}

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(email, id){
    try {
      let sql = "SELECT * FROM account WHERE email = $1"
      let params = [email]
      if (id) {
        sql += " AND id != $2"
        params.push(id)
      }
      const emailReturn = await pool.query(sql, params)
      return emailReturn.rowCount
    } catch (error) {
      return error.message
    }
  }

  /* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT id, firstname, lastname, email, type, password FROM account WHERE email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, updateAccount, updatePassword};