const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'zenab',
    password : '',
    database : 'smart-brain'
  }
});

app.get('/', (req, res) => {
	res.send('this is working');
});

app.post('/signin', (req, res) => {
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
    });

app.post('/register', (req, res) => {
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
});

app.get('/profile/:id', (req, res) => {
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
});

app.put('/image', (req, res) => {
  db('users').where({
    id: req.body.id
  })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('could not find user'));

});

app.listen(3000, ()=>{
	console.log('app is listening to port 3000');
});
