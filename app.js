// Imports
var express = require('express');
var mongo = require('mongodb');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs')

var secretsRaw = fs.readFileSync("secrets.json")
var secrets = JSON.parse(secretsRaw)

//Cliente de Mongo
var mongoClient = mongo.MongoClient;

//Crear servidor
var app = express();

//Middleware
app.use(cors());
app.use(bodyParser.json())

app.use(express.static('/home/ubuntu/3r'))

//app.use(express.static('C:\\Proyectos\\projects\\3rtest\\myApp\\www'))

//Me conecto a Mongo
mongoClient.connect(secrets["atlasURL"], { useNewUrlParser: true }, function(err, mongoConnection) {
  if (err) {
    throw err;
  }
  console.log("Conectado a Mongo");

  //Me conecto a la Base de datos
  var db = mongoConnection.db('products');
  console.log('Database abierta');

  //Configuro las rutas o endpoints
  //Vamos a hacer una API con CRUD (En este caso solo Read)
  app.get('/products', function (req, res) {
    db.collection('detailproducts').find().toArray(function(err, result) {
      if (err) {
        throw err;
      }
    res.send(result);
    });
  });

  app.get('/products/:ean', function (req, res) {
    db.collection('detailproducts').find({ "ean": req.params.ean }).toArray(function(err, result) {
      if (err) {
        throw err;
      }
    res.send(result[0]);
    });
  });


  //Pongo el server a escuchar
  console.log("Escuchando en puerto 443!");
  //console.log("Escuchando en puerto 3000!");

  //app.listen(3000);
  app.listen(443);

});