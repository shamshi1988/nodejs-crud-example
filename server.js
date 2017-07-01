const express = require('express');
const bodyParser= require('body-parser')
const app = express();

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
const MongoClient = require('mongodb').MongoClient

//var http=require('http');
// var server=http.createServer(function(req,res){
//     res.end('test');
// });

// server.on('listening',function(){
//     console.log('ok, server is running');
// });

//server.listen(80);

//var port = process.env.PORT || 4200;




var db

MongoClient.connect('mongodb://root:test@ds127892.mlab.com:27892/firstapptodo', (err, database) => {
  if (err) return console.log(err)
  db = database
  
})

app.listen(3001, function() {
	  app.get('/', (req, res) => {
	  	db.collection('quotes').find().toArray(function(err, results) {
		  if (err) return console.log(err)
    // renders index.ejs
	    		res.render('index.ejs', {quotes: results})
			  // send HTML file populated with quotes here
			})
		//res.sendFile(__dirname + '/index.html')
	})
	app.post('/quotes', (req, res) => {
	  db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	  })
	})
	//Update Request
	app.put('/quotes', (req, res) => {
		  db.collection('quotes')
		  .findOneAndUpdate({name: 'Somrita'}, {
		    $set: {
		      name: req.body.name,
		      quote: req.body.quote
		    }
		  }, {
		    sort: {_id: -1},
		    upsert: true
		  }, (err, result) => {
		    if (err) return res.send(err)
		    res.send(result)
		  })
		})

	//delete data
	app.delete('/quotes', (req, res) => {
	  db.collection('quotes').findOneAndDelete({name: req.body.name},
	  (err, result) => {
	    if (err) return res.send(500, err)
	    res.send({message: 'A darth vadar quote got deleted'})
	  })
	})

})


















