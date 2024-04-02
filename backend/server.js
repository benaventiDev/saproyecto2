var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')
var app = express()
const mongoose = require('mongoose')

var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use('/public', express.static('public'));

const mongoURI = 'mongodb+srv://mongodb:abc123**@cluster0.vwzmefm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var Users = require('./routes/Users')
var Tickets = require('./routes/Tickets')





app.use('/backend/users', Users)
app.use('/backend/tickets', Tickets)

// Health check route
app.get('/backend', (req, res) => {
  res.status(200).send(`OK from backend: ${req.path}`);
});
app.get('*', (req, res) => {
  res.status(200).send(`OK: ${req.path}`);
});
app.post('*', (req, res) => {
  res.status(400).send(`OK: ${req.path}`);
});


app.listen(port, function () {
  console.log('Server is running on port: ' + port)
})
