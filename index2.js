const express = require("express");

//database
const database = require("./database");
//initialise express
const booky = express();
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
  return res.json ({publications: database.publications})
});
booky.listen(3000,()=>{
  console.log("server is up and running");
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