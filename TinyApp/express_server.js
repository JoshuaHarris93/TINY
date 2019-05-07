var express = require("express");
var app = express();
var PORT = 8080; 

// var urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };


var urlDatabase = [
    {long: "http://www.lighthouselabs.ca", short: "#"},
    {long: "http://www.google.com", short: "#"}
];
  


app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    
    let templateVars = { urls: urlDatabase };
 
    res.render("urls_index", templateVars);
    
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

