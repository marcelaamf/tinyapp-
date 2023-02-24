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
    password: "123",
    id: "abc",
    email: "abc@example.com"
  },
  mmn: {
    password: "456",
    id: "mmn",
    email: "mml@example.com"
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
//Generate a Random Ids
const generateRandomString = function() {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomUrl = "";
  let shortUrlLength = 6;
  for (let i = 0; i < shortUrlLength; i++) {
    randomUrl += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomUrl;
};

const findUserId = function (email, users) {
   for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
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


//GET ROUTES
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

//GET redirect the short url to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    res.status(404).send("Sorry, page not found!");
    return;
  }
  res.redirect(longURL);
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

//GET to load the register page
app.get('/register', (req, res) => {
  if (req.cookies.userId) {
    res.redirect("/urls")
  }
 
  res.render("register");
});


//POST routes
//

//POST route to generate new url
app.post("/urls", (req, res) =>{
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
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

//POST to the login page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(400).send("Please provide an email and password")
  }
   if (!findUserId (email, users)) {
      return res.status(400).send ("No user with that email");
    }
    if (findUserId (email, users).password !== password) {
      return res.status(400).send ("Wrong password");
    }
  res.cookie("userId", findUserId (email, users).id);
  res.redirect("/urls");
});

// Post to clear the user cookies and logout
app.post("/logout", (req, res) => {
  res.clearCookie('userId');
  res.redirect ("/urls");
});

// Post to the register page
app.post("/register", (req, res) => {
  const newId = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password) {
    return res.status(400).send("Please provide an email address and password")
  }

  if (findUserId(email, users)) {
    return res.status(400).send("This email is already in use");
  }
  users[newId] = newId;
  users[newId]= {
    password,
    id: newId,
    email
  }
  res.redirect ("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});