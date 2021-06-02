const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require("mongodb");

const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
app.use(cors());

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

let password = "6zKh2lsl43cTmJie"
let db = "testCollections"

const url = "mongodb+srv://applicant:"+password+"@project0cluster.eexyt.mongodb.net/"+db+"?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true"   

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