var express = require('express');
var app = express();
var hbs = require('express-handlebars');
var mongoose = require('mongoose');

//Handlebars
app.engine('hbs', hbs());
app.set('view engine', 'hbs');

//Recibir informacion desde formulario y JSON
app.use(express.urlencoded());
app.use(express.json());

//Base de datos
mongoose.connect('mongodb://localhost:27017/tpdos', {useNewUrlParser: true, useUnifiedTopology: true});

var posteosSchema = mongoose.Schema({
    nombre: String,
    posteo: String
});

var Posteo = mongoose.model('posteos', posteosSchema);



app.get('/postear', function(req, res){
    res.render('posteos');
});

app.post('/posteos', async function(req, res){
    var post = new Posteo();
    post.nombre = req.body.nombre;
    post.posteo = req.body.posteo;
    await post.save();
    res.redirect('/');
});

app.get('/', function(req, res) {
    Posteo.find({}, function (err, novedades) {
        if (err) {
          return console.error(err);
        } else {
          res.format({
            html: function(){
                res.render('novedades', {
                      title: 'Novedades',
                      "novedades" : novedades.reverse()
                  });
            },
            json: function(){
                res.json(novedades);
            }
        });
    }     
    });
});

module.exports = app;

//Servidor
app.listen(3000, function(){
    console.log("Corriendo en el puerto 3000!");
});
