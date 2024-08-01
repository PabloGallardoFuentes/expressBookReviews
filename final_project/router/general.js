const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
    if(!doesExist(username)){
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }

  return res.status(404).json({message: "Unable to register user."});
});
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

function fetchBooks(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books);
    }, 1000);
  })
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const books = await fetchBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

function fetchBookISBN(isbn){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books[isbn])
    }, 1000);
  })
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
    const books = await fetchBookISBN(req.params.isbn);
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
 });

function fetchBookAuthor(author){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const auth = author;
      let authorBooks = [];

      for(let key in books){
        //console.log(books[key].author, auth);
        if(books[key].author === auth){
          authorBooks.push(books[key]);
        }
        resolve(authorBooks);
      }
    }, 1000);
  })
}
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const books = await fetchBookAuthor(req.params.author);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
  
});

function fetchBookTitle(title){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let titleBooks = [];

      for(let key in books){
        //console.log(books[key].author, auth);
        if(books[key].title === title){
          titleBooks.push(books[key]);
        }
        resolve(titleBooks);
      }
    }, 1000);
  })
}

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const books = await fetchBookTitle(req.params.title);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn){
    res.send(books[isbn].reviews);
  }
});

module.exports.general = public_users;
