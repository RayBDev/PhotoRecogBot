const refreshAuthToken = (req, res, db, generateAccessToken) => {
  // Get New Entry Count
  db.select(['id', 'name', 'email', 'entries', 'created_at'])
    .from('users')
    .where('email', '=', email)
    .then((user) => {
      // Generate New Tokens
      const token = generateAccessToken(user[0]);

      // Respond with refreshed cookies
      res.cookie('token', token, {
        domain: process.env.DOMAIN_URL,
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours,
        sameSite: 'none',
      });
      res.cookie('checkToken', true, {
        domain: process.env.DOMAIN_URL,
        secure: true,
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours,
        sameSite: 'none',
      });

      res.json(user[0]);
    })
    .catch((err) => res.status(400).json('database error'));
};

module.exports = {
  refreshAuthToken: refreshAuthToken,
};
