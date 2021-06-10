const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");
const ObjectID = require('mongodb').ObjectID;

const app = express();
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
if(process.env?.NODE_ENV === "production"){
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}
const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

let password = "6zKh2lsl43cTmJie"
let db = "testCollections"

const url = "mongodb+srv://applicant:"+password+"@project0cluster.eexyt.mongodb.net/"+db+"?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true"   

const path = require('path');
const { rejects } = require('assert');

const assign = (property, value) => {
  const newObject = {};
  newObject[property] = value;
  return newObject;
}


MongoClient.connect(url)
  .then((client) => {
    const keys = client.db("testCollections").collection("keys")
    const units = client.db("sc2").collection("units")

    app.get('/api/hello', (req, res) => {
      keys.find().toArray().then(results => {
        setTimeout(() => res.send({keys: results, other: "foobar"}), 0);
      })
    });

    app.get('/api/units', (req, res) => {
      units.find().toArray().then(results => {
        setTimeout(() => res.send({units: results}), 0);
      })
    })

    app.put('/api/update/:id', (req, res) => {
      console.log("I'm updating, here's my data: ")
      console.log('req.operation', req.body.operation)
      console.log('req.body.', req.body.attribute)
      units.findOneAndUpdate({_id: new ObjectID(req.params.id)}, assign(req.body.operation, req.body.attribute), {returnOriginal: false})
        .then(results => {
          // console.log("result:", results.value.attacks[0].bonuses)
          res.send({unit: results, foo: "bar"})
        }).catch(err =>{
          console.error('err', err)
        })
      
    })
      
  })
  .catch(err => {
    console.log('err', err)
  })

//   function run() {
//   console.log('running')
//   try {
//       await client.connect();
//       console.log("Connected correctly to server");
//   } catch (err) {
//       console.log(err.stack);
//   }
//   finally {
//       await client.close();
//   }
// }
// run();
// MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
//   console.log('err', err)
//   console.log('db', db)
// });



app.listen(port, () => console.log(`Listening on port ${port}`));