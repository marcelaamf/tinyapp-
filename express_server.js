const express = require('express');
const app = express();
const PORT = 8080;

/**CONFIG**/
app.set("view engine", "ejs");

/**DATABASE**/
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/**MIDDLEWARE**/
// Body parser
app.use(express.urlencoded({ extended: true }));

/**HELPER FUNCTIONS**/
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

/**HTML**/
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

/****ROUTES****/
// GET route for new url page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// GET route for urls main page
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// GET route for short urls  page
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
  res.render("urls_show", templateVars);
});

//POST route to generate new url
app.post("/urls", (req, res) =>{
  const id = generateRandomString();
  urlDatabase[id] = req.body.longURL;
  res.redirect(`/urls/${id}`);
});

//GET any request to the short url an take it to its longURL
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

//POST route to edit a shortURL
app.post('/urls/:id', (req, res) =>{
const id = req.params.id;
const newId = req.body.longURL;
urlDatabase[id] = newId;
res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`);
});