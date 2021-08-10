require ("dotenv").config();



const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Database
const database = require("./database");

//Initialise express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("connection established"));
/*
Route               ROOT(/)
Description        Get all the books
Access             PUBLIC
Parameter          None
Methods            Get
*/
booky.get("/",(req,res)=> {
  return res.json({books: database.books});
});
/*
Route              /is
Description        Get specific book on isbn
Access             PUBLIC
Parameter          isbn
Methods            Get
*/
booky.get("/is/:isbn",(req,res)=>{
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  )

  if(getSpecificBook.length === 0){
    return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
  }
  return res.json ({book: getSpecificBook});
});
/*
Route              /c
Description        Get specific book on category
Access             PUBLIC
Parameter          category
Methods            Get
*/
booky.get("/c/:category", (req,res)=> {
  const getSpecificBook = database.books.filter (
    (book) => book.category.includes(req.params.category)
  )
  if(getSpecificBook.length===0){
    return res.json({error: `No book found for the category of ${req.params.category}`})
  }
  return res.json ({book : getSpecificBook});
});
/*
Route              /l/language
Description        Get specific book based on languages
Access             PUBLIC
Parameter          languages
Methods            Get
*/
booky.get("/l/:language",(req,res)=> {
  const getSpecificBook = database.books.filter(
    (book) => book.language.includes(req.params.language)
  )
  if (getSpecificBook.length===0){
    return res.json({error: `No book found for the language of ${req.params.language}`})
  }
  return res.json({language : getSpecificBook});
});
/*
Route              /author
Description        Get all authors
Access             PUBLIC
Parameter          None
Methods            Get
*/
booky.get("/author",(req,res)=>{
  return res.json({authors: database.author});
});
/*
Route            /author/book
Description      Get a list of all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/author/book/:isbn",(req,res)=>{
  const getSpecificAuthor = database.author.filter (
    (author) => author.books.includes(req.params.isbn)
  ) ;
  if(getSpecificAuthor.length===0){
    return res.json ({error: `No author found for the book of ${req.params.isbn}`
    });
    return res.json ({author: getSpecificAuthor});
  }
});
/*
Route            /author
Description      Get a  specific author
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/author/:id",(req,res) =>{
  const getSpecificAuthor=database.author.filter(
    (author) => author.id === parseInt(req.params.id)
  );
  if(getSpecificAuthor.length === 0){
    return res.json({error:`No author found for the id of ${req.params.id}`});
    }
  return res.json({author:getSpecificAuthor});
});
/*
Route              /publications
Description        Get all publication
Access             PUBLIC
Parameter          none
Methods            Get
*/
booky.get("/publications",(req,res)=>{
  return res.json ({publications: database.publication})
});

/*
Route              /publications
Description        Get specific publication
Access             PUBLIC
Parameter          name
Methods            Get
*/
booky.get("/publications/:name",(req,res)=>{
  const getSpecificPublication = database.publication.filter(
    (publication) =>publication.name === (req.params.name)
  );
  if(getSpecificPublication.length === 0){
    return res.json({error:`No book found for the publication of ${req.params.name}`});
  }
  return res.json({publication:getSpecificPublication});
});
/*
Route            /PUBLICATIONS/book
Description      Get list of all publications based on books
Access           PUBLIC
Parameter        BOOKS
Methods          GET
*/
booky.get("/publications/book/:isbn",(req,res)=>{
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  );

if(getSpecificPublication.length === 0){
  return res.json({
    error: `No Publication found for the book of ${req.params.isbn}`
  });
}
return res.json ({publications: getSpecificPublication});
});

//POST
/*
Route              /book/new
Description       Add new books
Access             PUBLIC
Parameter          none
Methods            POST
*/
booky.post("/book/new",(req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});
/*
Route              /author/new
Description       Add new authors
Access             PUBLIC
Parameter          none
Methods            POST
*/
booky.post("/author/new",(req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json(database.author);
});
/*
Route              /publication/new
Description       Add new publications
Access             PUBLIC
Parameter          none
Methods            POST
*/
booky.post("/publication/new",(req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});

/*
Route              /publication/update/new
Description       update/Add new publications
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/
booky.put("/publication/update/book/:isbn", (req,res)=>{
  database.publication.forEach((pub) => {
    if(pub.id===req.body.pubId){
      return pub.books.push(req.params.isbn);
    }
  });
  //update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn){
      book.publications = req.body.pubId;
      return;
    }
  });
  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated publications"
    }
  );
});

//DELETE
/*
Route              /book/delete
Description      delete a book
Access             PUBLIC
Parameter          isbn
Methods            DELETE
*/

booky.delete("/book/delete/:isbn",(req,res) => {
  //whichever book that doesnt  match with isbn,send an updated book database array
  //and rest will be filtered out
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;

  return res.json({books: database.books});
});
/*
Route              /book/delete/author
Description      delete a book and vice versa
Access           PUBLIC
Parameter        isbn, authorId
Methods          DELETE
*/


booky.delete("/book/delete/author/:isbn/:authorId",(req,res)=>{
  //update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }

  });
  //update the author database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
     const newBookList = eachAuthor.books.filter(
       (book) => book !== req.params.isbn
     );
     eachAuthor.books = newBookList;
     return;
    }

  });
   return res.json({
     book: database.books,
     author: database.author,
     message: "Author was deleted !"
   });
});
  booky.listen(3000,()=>{
    console.log("server is up and running");
  });
