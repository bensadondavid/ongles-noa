const pool = require('../db');

const logOut = async (req, res) => {
  try {
    const refreshToken = req.cookies?.['refresh-token'];

    // Même si pas de cookie, on clear quand même et on répond 204
    if (refreshToken) {
      await pool.query('DELETE FROM noa_ongles_refresh_tokens WHERE token = $1', [refreshToken]);
    }

    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie('refresh-token', {
      httpOnly: true,
      sameSite: isProd ? 'none' : 'lax',
      secure: isProd,
      path: '/',
    });
    console.log('disconnected')
    return res.status(200).json({message : 'Log Out Successfull'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = logOut;