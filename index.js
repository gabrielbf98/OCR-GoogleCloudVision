

const express = require('express')
const mongoose = require('mongoose')
const port = 3009;
const path = require('path')
const fs =require('fs')
require('dotenv').config()
const textImageRoute = require('./routes/textImage')
const handWritingRoute = require('./routes/handwriting')

const connect = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/ocrGoogle', {useNewUrlParser: true, useUnifiedTopology: true});
      console.log('connected to mongodb')
    } catch (error) {
      console.log(error)
    }
}

const app = express();

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/aluno/Downloads/ocrGoogle-master/19196-75ea07bc200f.json' // inserir credenciais


app.disable('x-powered-by')
app.set('view engine', 'ejs');

//use main routes
app.use('/textImage', textImageRoute);
app.use('/handwriting', handWritingRoute)

//define an error handling route that renders an error page

// other routes
app.get('/', async(req, res) => {
  res.send('welcome to the ocr App')
})

app.get('/download/:filename', async(req, res, next) => {
  try {
    res.download(path.join(process.cwd() +  `/downloads/${req.params.filename}`), 'file.txt')
  } catch (error) {
    next(error)
  }
})

app.get('*', async(req, res) => {
  res.redirect('/')
})

function errorHandler (err, req, res, next) {
  res.status(500)
  res.render('error', { error: err })
}

app.use(errorHandler)


app.listen(port, () => {
  console.log(`app is listening on ${port}`)
  connect()
})
