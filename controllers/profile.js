
const handleProfile = (req, res, db) => {
  db('users').where({
    id: req.params.id
  }).select('*')
    .then(user => {
      if(user[0].id){
        res.json(user[0])
      }else {
        res.json('unable to find user')
      }
    })
    .catch(err => res.status(400).json('no such user'));
};

module.exports = {
  handleProfile : handleProfile
};