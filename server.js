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
  version: '7.2',
  connection: {
    host : '127.0.0.1',
    user : 'zenab',
    password : '',
    database : 'smart-brain'
  }
});

const database =
	{ users :
		[
			{
				id: '124',
				name: 'john',
				email: 'john@gmail.com',
				password: 'john',
				entries: 0,
				joined: new Date()
			},
			{
				id: '125',
				name: 'Sally',
				email: 'sally@gmail.com',
				password: 'sally',
				entries: 0,
				joined: new Date()
			}
		],
    login: [
      {
        id: '124',
        hash: '',
        email: 'john@gmail.com'
      },
      {
        id: '125',
        hash: '',
        email: 'sally@gmail.com'
      }
    ]
	}
	;


app.get('/', (req, res) => {
	res.send('this is working');
});

app.post('/signin', (req, res) => {
  // if (bcrypt.compareSync(req.body.password, database.login[database.login.length - 1].hash)) {
  //   res.json('success');
  // } else {
  //   res.status(400).json('error signing in');
  // }
	if(req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password){
		res.json(database.users[0])
	} else{
		res.status(400).json('error signing in');
	}
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  db('users')
    .returning('*')
    .insert({name: name, email: email, joined: new Date()})
    .then(user => {
      res.json(user[0])
    })
    .catch(err => res.status(400).json('unable to register'));
  // db('login').insert({email: email, hash:bcrypt.hashSync(password, 10) });

  // database.users.push({
  //   id: '126',
  //   name: name,
  //   email: email,
  //   password: password,
  //   entries: 0,
  //   joined: new Date()
  // });
  //
  // database.login.push({
  //   id: '126',
  //   hash: bcrypt.hashSync(password, 10),
  //   email: email
  // });
  // res.json(database.users[database.users.length -1]);
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

  // let found = false;
  // database.users.forEach(user => {
  //   if(req.params.id === user.id){
  //     found = true;
  //     return res.json(user);
  //   }
  // });
  // if(!found){
  //   res.status(400).json('no such user');
  // }
});

app.put('/image', (req, res) => {
  let found = false;
  database.users.forEach(user => {
    if(req.body.id === user.id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if(!found){
    res.status(400).json('no such user');
  }

});

app.listen(3000, ()=>{
	console.log('app is listening to port 3000');
});
