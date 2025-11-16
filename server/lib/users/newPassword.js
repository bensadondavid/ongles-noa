const pool = require('../db')
const bcrypt = require('bcryptjs')

const newPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {}

    if (!token || !password) {
      return res.status(400).json({ message: 'Missing fields' })
    }
    if (String(password).length < 8) {
      return res.status(400).json({ message: 'Password too short (min 8)' })
    }
    const hashed = await bcrypt.hash(password, 10)
    const update = await pool.query(
      `UPDATE noa_ongles_users
         SET hashed_password = $1,
             reset_password_token = NULL,
             reset_password_expiration = NULL
       WHERE reset_password_token = $2
         AND reset_password_expiration > NOW()
       RETURNING id`,
      [hashed, token]
    )

    if (update.rowCount === 0) {
      return res.status(400).json({ message: 'Invalid or expired link' })
    }

    const userId = update.rows[0].id

    return res.status(200).json({ message: 'Password updated' })
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal Error' })
  }
}

module.exports = newPassword