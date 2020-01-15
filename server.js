const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

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

app.get('/', (req, res) => { res.send('this is working') });

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) } );

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) } );

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) } );

app.listen(process.env.PORT, ()=>{
	console.log(`app is listening to port ${process.env.PORT}`);
});
