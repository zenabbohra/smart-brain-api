
const handleSignin = (req, res, db, bcrypt) => {
  const { email, password } = req.body;

  db('login').where({
    email: email,
  })
    .returning('*')
    .then(response => {
      if (response[0].id) {
        if (bcrypt.compareSync(password, response[0].hash)) {
          db('users').where({
            email: email
          })
            .returning('*')
            .then(user => {
              res.json(user[0]);
            })
        } else {
          res.json('incorrect password');
        }
      } else {
        res.json('incorrect username');
      }
    })
    .catch(err => res.status(400).json('no such username'));
};

module.exports = {
  handleSignin : handleSignin
};