const handleSignin = (req, res, db, bcrypt, generateAccessToken) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  db.select('email', 'hash')
    .from('users')
    .where('email', '=', email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select(['id', 'name', 'email', 'entries', 'created_at'])
          .from('users')
          .where('email', '=', email)
          .then((user) => {
            const token = generateAccessToken(user[0]);

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
          .catch((err) => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('database error'));
};

module.exports = {
  handleSignin: handleSignin,
};
