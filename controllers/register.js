
const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  db.transaction(trx => {
    trx.insert({
      email: email,
      hash: hash
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx.insert({
          name: name,
          email: loginEmail[0],
          joined: new Date()
        })
          .into('users')
          .returning('*')
          .then(user => {
            if(user[0].id){
              res.json(user[0]);
            }else{
              res.json('user could not be registered');
            }
          })
          .catch(err => res.status(400).json('unable to register'));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
};
module.exports = {
  handleRegister: handleRegister
};