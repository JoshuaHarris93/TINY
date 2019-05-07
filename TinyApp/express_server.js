var express = require("express");
var app = express();
var PORT = 8080; 

// urlDatabaseObject = {
//     bob: "http://google.com",
//     potato:"https://motherfuckingwebsite.com"
// }
var urlDatabase = {
    h3jk3n: "http://www.lighthouselabs.ca", 
    l3j4jj: "http://google.com"
}
  
app.get("/urls/:shortURL", (req, res) => {
    // console.log(urlDatabase[req.params.shortURL])
    const shortURL = req.params.shortURL;
    let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[shortURL]};
    res.render("urls_show", templateVars);
    // res.send("OK")
  });

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

