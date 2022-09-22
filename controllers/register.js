const handleRegister = (req, res, db, bcrypt, generateAccessToken) => {
  const { email, name, password, created_at } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash,
        email,
        name,
        created_at,
      })
      .into('users')
      .returning(['id', 'name', 'email', 'entries', 'created_at'])
      .then((user) => {
        const token = generateAccessToken(user[0]);
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
        res.json(user[0]);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(err));
};

module.exports = {
  handleRegister: handleRegister,
};
