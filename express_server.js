// Require (connect) dependancies
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

// Use dependancies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["lighthouse"]
  })
);

//Collects user data upon registration
const users = {};

//contains a database of urls (hardcoded) with a key that has been randomly generated using or generateRandomString function
const urlDatabase = {};

//Generate a random string for userID upon registration
function generateRandomString() {
  let randomize = Math.random()
    .toString(36)
    .substring(7);
  return randomize;
}

//Updates short URL
function updateURL(short, long) {
  return (urlDatabase[short].longURL = long);
}

//Loops through urlDatabase to compare userID with the id passed into the req.body (input field)
function urlsForUser(id) {
  let outputDb = {};
  for (const sURL in urlDatabase) {
    if (urlDatabase[sURL].userID === id) {
      outputDb[sURL] = urlDatabase[sURL];
    }
  }
  return outputDb;
}

//allows you to connect your express server to front end templates
app.set("view engine", "ejs");

//POST endpoints:

//our login endpoint checks that the username and hashed password are correct and allows the user to login if they match
app.post("/login", (req, res) => {
  let { email, password } = req.body;
  for (let userIndex in users) {
    if (email === users[userIndex].email) {
      if (bcrypt.compareSync(password, users[userIndex].hashedPassword)) {
        req.session.user_id = userIndex;
        res.redirect("/urls");
        return;
      }
    }
  }
  res.status(403).send("Error: wrong username or password");
});

/* 
Our register endpoint allows a new user to register. Upon registration, the users password is encrypted using bcrypt, and the new 
username and password are then compared with all the current usernames and passwords in the users object. If that username and password
combination exists, the page redirects to a 400 error page.
*/
app.post("/register", (req, res) => {
  let id = generateRandomString();
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  let email = req.body.email;
  console.log(users)
  if (!email || !password) {
    return res.send("ERROR: Enter an email and password");
  }

  for (let key in users) {
    if (email === users[key].email) {
      return res.send("ERROR: User with the provided email already exists");
    }
  }

  if (email && password) {
    let obj = {
      id: id,
      email: email,
      hashedPassword: hashedPassword
    };
    users[id] = obj;
    req.session.user_id = id;
  }
  res.redirect("/urls");
});

//logout button redirects you to the login page
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

/* URL shortener (enter a url to shorten and press submit - it then redirects you to the same 
page that now contains your recently added URL's) */
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  let longURL = req.body.longURL;
  let userID = req.session.user_id;
  urlDatabase[shortURL] = { longURL, userID };

  res.redirect("/urls");
});

//If a user is logged in, they can delete their own URL's
app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.session.user_id) {
    delete urlDatabase[req.params.shortURL];
  } else {
    res.send("You are not logged in!");
  }
  res.redirect("/urls");
});

//edit button! Allows you to edit (change) your URL
app.post("/urls/:shortURL/update", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = req.body.longURL;
  updateURL(shortURL, longURL);
  res.redirect("/urls");
});

//GET (read) endpoints:

app.get("/login", (req, res) => {
  let templateVars = {
    userObj: users[req.session.user_id]
  };
  
  if (req.session.user_id) {
    res.redirect("/urls");
  }
  else {
  res.render("urls_login", templateVars);
  }
  
});

app.get("/register", (req, res) => {
  let templateVars = {
    userObj: users[req.session.user_id]
  };
  res.render("urls_registration", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const long = urlDatabase[req.params.shortURL].longURL;
  res.redirect(long);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    userObj: users[req.session.user_id]
  };
  if (req.session.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let user = users[req.session.user_id];
  if (!user) {
    res.status(403).send("Forbidden");
    return;
  }
  const myUrls = urlsForUser(req.session.user_id);
  const shortURL = req.params.shortURL;

  if (myUrls[shortURL]) {
    let templateVars = {
      userObj: users[req.session.user_id],
      shortURL: shortURL,
      longURL: urlDatabase[shortURL].longURL
    };

    res.render("urls_show", templateVars);
  } else {
    res.status(403).send("Forbidden");
  }
});

app.get("/urls", (req, res) => {
  let user = users[req.session.user_id];
  let templateVars = {
    userObj: users[req.session.user_id],
    urlShow: urlsForUser(req.session.user_id)
  };
  console.log(templateVars.urlShow)

  if (!user) {
    res.redirect("/login");
    return;
  } else {
    res.render("urls_index", templateVars);
  }
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
