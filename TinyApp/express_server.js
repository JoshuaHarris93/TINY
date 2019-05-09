const express = require("express");
const app = express();
const PORT = 8080;

function generateRandomString() {
  var randomize = Math.random().toString(36).substring(7);
  return randomize;
}

function updateURL(short, long) {
  return urlDatabase[short] = long;
}


let urlDatabase = {
  h3jk3n: "http://www.lighthouselabs.ca",
  l3j4jj: "http://google.com"
};

// var keyNameWahtever = 'a new key here'
// urlDatabase[keyNameWahtever] = 'my new value'
// let urlDatabase = {
//   h3jk3n: "http://www.lighthouselabs.ca",
//   l3j4jj: "http://google.com",
//   'a new key here': 'my new value'
// };

app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
  });

app.post("/urls/:shortURL/delete", (req, res) => {
    delete urlDatabase[req.params.shortURL];
        res.redirect('/urls');
    
});

app.post("/urls/:shortURL/update", (req, res) => {
  //extract short URL from URL path
  //extract longURL from form submission(after submit) hint: body-parser
  //create function that will update your URL
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  updateURL(shortURL, longURL);
  // res.redirect('/urls', longURL);
  res.redirect("/urls");
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
    shortURL: shortURL,
    longURL: urlDatabase[shortURL]
  };
  res.render("urls_show", templateVars);
  
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


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
