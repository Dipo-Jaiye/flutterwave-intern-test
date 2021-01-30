// server.js

const myApp = require('./myApp');



// listen for requests :)
const listener = myApp.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
