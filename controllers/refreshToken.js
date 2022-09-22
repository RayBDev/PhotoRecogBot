const refreshAuthToken = (req, res, generateAccessToken) => {
  // Generate New Tokens
  const token = generateAccessToken({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    entries: req.user.entries,
    created_at: req.user.created_at,
  });
  // Respond with refreshed cookies
  res
    .cookie('token', token, {
      domain: process.env.DOMAIN_URL,
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours,
      sameSite: 'none',
    })
    .cookie('checkToken', true, {
      domain: process.env.DOMAIN_URL,
      secure: true,
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours,
      sameSite: 'none',
    });

  res.json(req.user);
};

module.exports = {
  refreshAuthToken: refreshAuthToken,
};
