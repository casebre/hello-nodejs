var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//Importing a lib from a non package or own lib
var Vehicle = require('./app/models/vehicle');

//Configure app for bodyParser
// lets us grab data from the body of POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Set up a server PORT
var port = process.env.PORT || 3000; //If environment variables are set,
//use it, otherwise, 3000

//Connect to DB
mongoose.connect('mongodb://localhost:27017/hello');

//Set up AP routes
var router = express.Router();

//Routes will be pre fixed with /api
app.use('/api', router);

//Middleware
// Before reaching the router, Middleware will step in and run some processes
// e.g. validations
router.use(function(req, res, next) {
    console.log('processing something before routing');
    next();
});

//Test routes
router.get('/', function(req, res) {
  res.json({message: 'Welcome to Casebre API'});
});

//Setup more routes... Starting with Vehicle route
router.route('/vehicles')
.post(function(req, res) {
    var vehicle = new Vehicle();
    vehicle.make = req.body.make;
    vehicle.model = req.body.model;
    vehicle.colour = req.body.colour;

    vehicle.save(function(err) {
        if(err) {
            res.send(err);
        }

        res.json({message: 'Vehicle was successfully manufactured '});
    });
})

.get(function(req, res) {
    Vehicle.find(function(err, vehicles) {
        if(err) {
            res.send(err);
        }

        res.json(vehicles);

    });
});

router.route('/vehicle/:vehicle_id')
    .get(function(req, res) {
        Vehicle.findById(req.params.vehicle_id, function(err, vehicle) {
            if(err) {
                res.send(err);
            }

            res.json(vehicle);
        });
    });

router.route('/vehicle/make/:make')
    .get(function(req, res) {
        //Find items where make: equals the param req.params.make
        Vehicle.find({make:req.params.make}, function(err, vehicle) {
            if(err) {
                res.send(err);
            }
                res.json(vehicle);
        });
    });
    router.route('/vehicle/colour/:colour')
        .get(function(req, res) {
            //Find items where make: equals the param req.params.make
            Vehicle.find({colour:req.params.colour}, function(err, vehicle) {
                if(err) {
                    res.send(err);
                } else {
                    res.json(vehicle);
                }
            });
        });

//Fire up server
app.listen(port)

//Print a message
console.log('Server listening on port ' + port);
