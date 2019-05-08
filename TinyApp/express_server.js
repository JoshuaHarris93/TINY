const express = require("express");
const app = express();
const PORT = 8080;

function generateRandomString() {
  var randomize = Math.random().toString(36).substring(7);
  return randomize;
}

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

// app.post("/urls", (req, res) => {
//     console.log(req.body);  // Log the POST request body to the console
//     res.send("Ok");         // Respond with 'Ok' (we will replace this)
//   });

app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
        res.redirect('/urls');
    
});

app.get("/u/:shortURL", (req, res) => {

  const longURL = urlDatabase[req.params.shortURL]
  console.log(req.params);
  res.redirect(longURL);

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

// delete shortURL;


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
