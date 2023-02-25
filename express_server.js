const express = require('express');
const app = express();
const PORT = 8080;

const morgan = require('morgan');
const cookie = require('cookie-parser');

//CONFIG/////////////////////////////////////////
//
app.set("view engine", "ejs");


//DATABASE//////////////////////////////////////
 //
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userId: "fiow7e"
  },
  sm5oxK: {
    longURL: "http://www.google.com",
    userId: "asdgd"
  }
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


//MIDDLEWARE/////////////////////////////////////////////
//

app.use(express.urlencoded({ extended: true }));
app.use(cookie());
app.use(morgan('dev'));

//HELPER FUNCTIONS////////////////////////////////////
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

const findUserId = function (email) {
  const userValues = Object.values(users);
  for (const user of userValues) {
    if (user.email === email) {
      return user;
    }
  }
};


const urlsForUser = function (userId) {
  const urls = {};
  const ids = Object.keys(urlDatabase);

  for (const id of ids) {
    const url = urlDatabase[id];
    if(url.userId === userId) {
      urls[id] = url;
    }
  }
return urls;
};

//HTML////////////////////////////////////////////
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


//GET ROUTES//////////////////////////////////
//

// GET route for urls main page
app.get("/urls", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  if (!user) {
    return res.status(404).send("Please login first")
  }
  const urls = urlsForUser(user.id)
  const templateVars = {urls, user};
  res.render("urls_index", templateVars);
});

// GET route for new url page
app.get("/urls/new", (req, res) => {
  const id = req.cookies.user_id;
  const user = users[id];
  if (!user) {
    return res.redirect("/login")
  }
    
  const templateVars = {user};
  res.render("urls_new", templateVars);
});


// GET route for short urls  page
app.get("/urls/:id", (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  
  if(!userId) {
    return res.status(404).send("the requested URL is not in the user's list")
  }
  const longURL = urlDatabase[req.params.id].longURL;

  const templateVars = {id: req.params.id, longURL, userId, user};
  res.render("urls_show", templateVars);
});

//GET redirect the short url to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;

  if (!urlDatabase[req.params.id]) {
    res.status(404).send("Sorry, page not found!");
    return;
  }
   res.redirect(longURL);
});

//GET to load the login page
app.get('/login', (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];
  if (user) {
    return res.redirect("/urls");
  }
  
  const templateVars = {user};
  res.render("login", templateVars);
});

//GET to load the register page
app.get('/register', (req, res) => {
  const userId = req.cookies.user_id;
  const user = users[userId];

  if (userId) {
    res.redirect("/urls")
  }
 
  const templateVars = {user};
  res.render("register", templateVars);
});


//POST routes/////////////////////////////////
//

//POST route to generate new url
app.post("/urls", (req, res) =>{
  const email = req.body.email;
  findId = findUserId(email); 
  const ids = generateRandomString();
  const user = req.cookies.user_id;
  console.log(user);
  urlDatabase[ids] = {
  longURL: req.body.longURL,
  userId: user,
  }
  if (!user) {
    return res.status(403).send("Please Login first");
  }
    
  res.redirect(`/urls/${ids}`);
});

//POST route to remove a URL 
app.post('/urls/:id/delete', (req, res) =>{
  const userID = req.cookies.user_id
  if (!userID) {
  return res.status(403).send("Please Login first");
}
  const id = req.params.id;
  if (!urlDatabase[id]) {
    return res.status(404).send("Page not found in the user's list");
  }
  if (userID !== urlDatabase[id].userId) {
    return res.status(403).send("User not autorized");
  }
  
  delete urlDatabase[id];
  res.redirect("/urls");
});

//POST route to edit a shortURL.
app.post('/urls/:id', (req, res) =>{
  const userID = req.cookies.user_id
  if (!userID) {
    return res.status(403).send("Please Login first");
  }
  const id = req.params.id;
  if (!urlDatabase[id]) {
    return res.status(404).send("Page not found in the user's list");
  }
  if (userID !== urlDatabase[id].userId) {
    return res.status(403).send("User not autorized");
  }
  
  const newId = req.body.longURL;
  urlDatabase[id].longURL = newId;
  res.redirect("/urls");
});

//POST to the login page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  const user = findUserId(email);

  if (!email || !password) {
    return res.status(400).send("Please provide an email and password")
  }
  if (!user || user.password !== password) {
    return res.status(403).send("No user with that email or password");
  }
     
  res.cookie("user_id", user.id);
  res.redirect("/urls");
});

// Post to clear the user cookies and logout
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect ("/login");
});

// Post to the register page
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  const user = findUserId(email);
  
  if (!email || !password) {
    return res.status(400).send("Please provide an email address and password")
  }

  if (user) {
    return res.status(400).send("This email is already in use");
  }

  const newUser = {id, email, password}
  users[id]= newUser
  
  res.cookie("user_id", newUser.id);
  console.log (users)
  
  res.redirect ("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});