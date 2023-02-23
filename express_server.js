const express = require('express');
const app = express();
const PORT = 8080;
const cookie = require('cookie-parser');

//CONFIG
//
app.set("view engine", "ejs");


//DATABASE
 //
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  abc: {
    username: "Marcela",
    password: "123",
    id: "abc"
  },
  mmn: {
    username: "Mila",
    password: "456",
    id: "mmn"
  }
};


//MIDDLEWARE//
//
// Body parser
app.use(express.urlencoded({ extended: true }));
// Cookie parser
app.use(cookie());


//HELPER FUNCTIONS//
//
//Generate a Random Short URL ID
const generateRandomString = function() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomUrl = "";
  let shortUrlLength = 6;
  for (let i = 0; i < shortUrlLength; i++) {
    randomUrl += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomUrl;
};


//HTML//
//
// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });


//ROUTES
//
// GET route for new url page
app.get("/urls/new", (req, res) => {
  const userId = req.cookies.userId;
  const user = users[userId];
  const templateVars = {
  user: user
  };
  res.render("urls_new", templateVars);
});

// GET route for urls main page
app.get("/urls", (req, res) => {
  const userId = req.cookies.userId;
  const user = users[userId];
  const templateVars = { 
    urls: urlDatabase, 
    user: users[userId]
  };
    res.render("urls_index", templateVars);
});

// GET route for short urls  page
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.userId;
  const user = users[userId];
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id], 
    user: users[userId]
  };
  res.render("urls_show", templateVars);
});

//POST route to generate new url
app.post("/urls", (req, res) =>{
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

//GET redirect the short url to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    res.status(404).send("Sorry, page not found!");
    return;
  }
  res.redirect(longURL);
});

//POST route to remove a URL 
app.post('/urls/:id/delete', (req, res) =>{
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect("/urls");
});

//POST route to edit a shortURL.
app.post('/urls/:id', (req, res) =>{
const id = req.params.id;
const newId = req.body.longURL;
urlDatabase[id] = newId;
res.redirect("/urls");
});

//GET to load the login page
app.get('/login', (req, res) => {
  const userId = req.cookies.userId;
  const user = users[userId];
  const templateVars = {
  user: user
  };
  res.render("login", templateVars);
});

//POST to the login page
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).send("Please provide an username and password")
  }

  let findUser = null;
  for (const userId in users) {
    const user = users[userId];
    if (user.username === username) {
      findUser = user;
    }
  }
    if (!findUser) {
      return res.status(400).send (" No user with that username");
    }
    if (findUser.password !== password) {
      return res.status(400).send ("Wrong password");
    }
  res.cookie("userId", findUser.id);
  res.redirect("/urls");
});

// Post to clear the user cookies and logout
app.post("/logout", (req, res) => {
res.clearCookie('userId');
res.redirect ("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});