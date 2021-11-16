// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();

// Node Fetch LAZY LOADING
let _fetch;
const fetch = () => {
  if (!_fetch) _fetch = require('node-fetch');
  return _fetch;
}
let _parser;
const HTMLParser = () => {
  if (!_parser) _parser = require('node-html-parser');
  return _parser;
}



// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

const BASE='https://cloud.google.com';

let cachedRoles;
const log = (el)=>{ console.log(el); return el}

const getIframeSrc = async () => {
  const rawHtml = await (await (fetch()(BASE+'/iam/docs/permissions-reference'))).text(); 
    const domParent =  HTMLParser().parse(rawHtml);
    return domParent.querySelector('iframe').attributes.src;
}

app.get('/roles', async (req, res) => {
    if (cachedRoles && cachedRoles.length) return res.send(cachedRoles);
    const src= await getIframeSrc();
    const  rawHtml2 = await (await (fetch()(BASE+src))).text(); 
    const dom =  HTMLParser().parse(rawHtml2);
    const data = [...dom.querySelectorAll('.list tr')]
       .map(el => [...el.querySelectorAll('td')]
            .map(el => el.text)
            .filter(text => text !== undefined)
            .map(text => text.trim().split('\n').map(t => t.trim().replace(/\)/,'').split('(')))
       );
    cachedRoles = data;
    res.send(data);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
