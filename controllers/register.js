
const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  if(!name){
    return res.status(400).json({err: 'name should not be empty'})
  } else if (typeof name !== 'string') {
    return res.status(400).json({err: 'name should be a string'});
  } else if(name.length >= 100) {
    return res.status(400).json({err: 'name should be less than 100 chars'});
  }
  if(!email){
    return res.status(400).json({err: 'email should not be empty'});
  } else if (typeof email !== 'string') {
    return res.status(400).json({err: 'email should be a string'});
  }else if(email.length >= 100 || email.length < 5){
    return res.status(400).json({err: 'email length should be greater than 5'});
  }
  if(!password){
    return res.status(400).json({err: 'password should not be empty'});
  } else if (typeof password !== 'string') {
    return res.status(400).json({err: 'password should be a string'});
  } else if(password.length > 30 || password.length < 3){
    return res.status(400).json({err: 'password length should be greater than 3'});
  }

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
          .catch(() => res.status(400).json({'err' : 'unable to register'}));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
};
module.exports = {
  handleRegister: handleRegister
};