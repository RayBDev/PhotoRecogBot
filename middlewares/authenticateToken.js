const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Get all cookies from request headers
  const { cookie } = req.headers;

  // Check to see if we got our cookies
  console.log(cookie);

  // Handle this as you please
  if (cookie == undefined) return res.sendStatus(401);

  const token = cookie.split('token=')[1].split(';')[0]; // Yep, it's a string
  console.log(token); // Check to see if we stored our cookie's JWT

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    console.log('error', err);

    if (err) return res.sendStatus(403);
    // if success upon verification,
    // issue new 'token' and 'checkToken'
    req.user = user;

    next();
  });
};

module.exports = authenticateToken;
