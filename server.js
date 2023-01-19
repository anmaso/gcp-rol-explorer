const express = require("express");
const app = express();

let common = require('./common');

app.use(express.static("public"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get('/roles', async (req, res) => {
    res.send(await common.getCachedData());
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
