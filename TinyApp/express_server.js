const express = require("express");
const app = express();
const PORT = 8080;

function generateRandomString() {
  var randomize = Math.random()
    .toString(36)
    .substring(7);
  return randomize;
}

console.log(generateRandomString());

// urlDatabaseObject = {
//     bob: "http://google.com",
//     potato:"https://motherfuckingwebsite.com"
// }
let urlDatabase = {
  h3jk3n: "http://www.lighthouselabs.ca",
  l3j4jj: "http://google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/urls", (req, res) => {
  console.log(req.body);
  let random = generateRandomstring();
  res.send("/urls/:shortURL", "301");
  res.redirect(urlDatabase[random], "/urls");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  // console.log(urlDatabase[req.params.shortURL])
  const shortURL = req.params.shortURL;
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[shortURL]
  };
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
