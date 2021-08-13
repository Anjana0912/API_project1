require ("dotenv").config();



const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Database
const database = require("./database/database");
//Models

const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
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
booky.get("/",async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});
/*
Route              /is
Description        Get specific book on isbn
Access             PUBLIC
Parameter          isbn
Methods            Get
*/
booky.get("/is/:isbn",async(req,res)=>{

  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});



//null !0 = 1 ,!1=0
  if(!getSpecificBook){
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
booky.get("/c/:category", async(req,res)=> {
  const getSpecificBook = await BookModel.findOne({category:req.params.category});
   //null !0=1 ,!1=0
  if(!getSpecificBook){
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
booky.get("/l/:language",async(req,res)=> {
  const getSpecificBook =  await BookModel.findOne ({language:req.params.language});
  //null !0=1 ,!1=0
  if (!getSpecificBook){
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
booky.get("/author",async(req,res)=>{
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});
/*
Route            /author/book
Description      Get a list of all authors based on books
Access           PUBLIC
Parameter        isbn
Methods          GET
*/
booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0){
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json({authors: getSpecificAuthor});
});

/*
Route            /author
Description      Get a  specific author
Access           PUBLIC
Parameter        id
Methods          GET
*/
booky.get("/author/:id",(req,res) =>{
    const getSpecificAuthor = database.author.filter(
        (author) => author.id == req.params.id
    );
    //null !0=1 ,!1=0
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
booky.get("/publications",async(req,res)=>{
  const getAllpublications = await PublicationModel.find();
  return res.json(getAllpublications);
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
        (publication) => publication.books.includes(req.params.name)
    );
  //null !0=1 ,!1=0
  if(getSpecificPublication.length===0){
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
booky.get("/publications/book/:isbn",async(req,res)=>{
  const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );

//null !0=1 ,!1=0
if(getSpecificPublication.length===0){
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
booky.post("/book/new",async (req,res) => {
  const { newBook } = req.body;
  const addNewBook = BookModel.create(newBook);
  return res.json({
    books: addNewBook,
    message: "Book was added !!!"
  });
});
/*
Route              /author/new
Description       Add new authors
Access             PUBLIC
Parameter          none
Methods            POST
*/
booky.post("/author/new",async(req,res) => {
  const { newAuthor } = req.body;
  const addNewAuthor = AuthorModel.create(newAuthor);
  return res.json({
    author: addNewAuthor,
    message:"Author was added"
   });
});
/*
Route              /publication/new
Description       Add new publications
Access             PUBLIC
Parameter          none
Methods            POST
*/
booky.post("/publication/new",async(req,res) => {
  const { newPublication } = req.body;
  const addNewPublication = PublicationModel.create(newPublication);
  return res.json({
    publication: addNewPublication,
    message:"Publication was added"
   });
});
/************PUT************/
/*
Route              /publication/update/book
Description       update book on isbn
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/

booky.put("/book/update/:isbn",async (req,res)=> {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json ({
    books: updatedBook
  });
});

/************Updating new author********/
/*
Route              /publication/update/new
Description       update/Add new publications
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/

booky.put("/book/author/update/:isbn", async(req,res) =>{
  //Update book database
const updatedBook = await BookModel.findOneAndUpdate(
  {
    ISBN: req.params.isbn
  },
  {
    $addToSet: {
      authors: req.body.newAuthor
    }
  },
  {
    new: true
  }
);

  //Update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.body.newAuthor
    },
    {
      $addToSet: {
        books: req.params.isbn
      }
    },
    {
      new: true
    }
  );

  return res.json(
    {
      books: updatedBook,
      authors: updatedAuthor,
      message: "New author was added"
    }
  );
} );



/*
Route              /publication/update/new
Description       update/Add new publications
Access             PUBLIC
Parameter          isbn
Methods            PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
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

booky.delete("/book/delete/:isbn", async (req,res) => {
  //Whichever book that doesnot match with the isbn , just send it to an updatedBookDatabase array
  //and rest will be filtered out

  const updatedBookDatabase = await BookModel.findOneAndDelete(
    {
      ISBN: req.params.isbn
    }
  );

  return res.json({
    books: updatedBookDatabase
  });
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
