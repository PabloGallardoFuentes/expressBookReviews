const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let usersWithName = users.filter((user) => {
    return user.username === username;
  });

  if (usersWithName > 0){
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log("asdfa");
  /*const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }*/
  res.send("meca");
  // Authenticate user
  /*if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }*/
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(req.session.authorization){
    let token = req.session.authorization['accessToken'];

    jwt.verify(token, "access", (err, user) => {
      if (!err){
        const username = user.username;
        console.log(username);
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    })
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(req.session.authorization){
    let token = req.session.authorization['accessToken'];

    jwt.verify(token, "access", (err, user) => {
      if (!err){
        const username = user.username;
        console.log(username);
        const book = books[isbn];
        if (book){
          for(let review in book.reviews){
            
          }
        }
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    })
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
