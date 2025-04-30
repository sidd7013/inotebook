const mongoose = require('mongoose');
const mongoURI ="mongodb://localhost:27017/";

//add "start":"nodemon index.js" in script of package.json after "test" otherise you will get nodeman not regcognised error.
//now instead of nodemon index.js command you can use npm start command to see mongodb server se connected or not.
//mongoose latest version no longer accepting call back function, so use then-catch and you can also make function async and .connct function as await
const connectToMongo = () => {
    mongoose.connect(mongoURI).then(()=> console.log("connected to Mongo successfully")).catch((e)=>console.log(e.message));
  
}

module.exports = connectToMongo;