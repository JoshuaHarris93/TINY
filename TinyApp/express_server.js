const express = require("express");
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

function generateRandomString() {
  let randomize = Math.random()
    .toString(36)
    .substring(7);
  return randomize;
}

function updateURL(short, long) {
  return (urlDatabase[short] = long);
}

let users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

let urlDatabase = {
  h3jk3n: "http://www.lighthouselabs.ca",
  l3j4jj: "http://google.com"
};

app.set("view engine", "ejs");

app.post("/login", (req, res) => {
  let { email, password } = req.body;
  
  for (let user in users) {
    if (email === users[user].email) {
      if (password === users[user].password) {
        res.cookie("user_id", user);
      }
    }
  }
  
  res.redirect("/urls");
});
//authenticate user - find user with that email, compare passwords. If there is a match, get the user ID.
//set the user id in the cookies

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let { email, password } = req.body;

  if (!email || !password) {
    res.redirect(400);
  }

  for (let user in users) {
    if (email === user.email) {
      res.redirect(400);
    } 
  }

  if (email && password) {
    let obj = {
      id: id,
      email: email,
      password: password
    };
    users[id] = obj;
    res.cookie("user_id", id);
  }
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
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

app.get("/login", (req, res) => {
  let templateVars = {
    userObj: users[req.cookies["user_id"]]
  };
  res.render("urls_login", templateVars);
  res.redirect("/urls");
})

app.get("/register", (req, res) => {
  let templateVars = {
    userObj: users[req.cookies["user_id"]]
  };
  res.render("urls_registration", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log(req.params);
  res.redirect(longURL);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    userObj: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  // console.log(urlDatabase[req.params.shortURL])
  const shortURL = req.params.shortURL;
  let templateVars = {
    userObj: users[req.cookies["user_id"]],
    shortURL: shortURL,
    longURL: urlDatabase[shortURL]
  };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
    userObj: users[req.cookies["user_id"]],
    urls: urlDatabase
  };
  res.render("urls_index", templateVars);
});

app.get("/", (req, res) => {
  let templateVars = {
    username: req.cookies["user_id"],
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// delete shortURL;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
