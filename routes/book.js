const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Author = require("../models/author");
const Book = require("../models/book");

const router = express.Router();
const uploadPath = path.join("public", Book.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

router.get("/", async (req, res) => {
  let query = Book.find();
  console.log(req.query.title);
  if (req.query.title != null && req.query.title != "") {
    query = query.regex("title", new RegExp(req.query.title, "i"));
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
    query = query.lte("publishDate", req.query.publishedBefore);
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
    query = query.gte("publishDate", req.query.publishedAfter);
  }

  try {
    const authors = await Author.find({});

    const books = await query.exec();
    console.log(books);
    res.render("books/index", {
      searchOption: req.query,
      authors: authors,
      books: books,
    });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

router.post("/", upload.single("cover"), async (req, res) => {
  const filename = req.file != null ? req.file.filename : null;

  const newbook = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    pageCount: req.body.pageCount,
    coverImageName: filename,
    publishDate: new Date(req.body.publishDate),
  });
  try {
    const createNewBook = await newbook.save();
    //res.redirect(`authors/${createdNewBook.id}`);
    res.redirect("/books");
  } catch (err) {
    if (newbook.coverImageName != null) {
      removeBookCover(newbook.coverImageName);
    }
    // console.log(err);
    renderNewPage(res, newbook, true);
  }
});

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({});
    const params = {
      authors: authors,
      book: book,
    };
    if (hasError) params.errorMessage = "Error creating";
    res.render("books/new", params);
  } catch (err) {
    res.redirect("/books");
  }
}
//remove if error
function removeBookCover(filename) {
  fs.unlink(path.join(uploadPath, filename), (err) => {
    if (err) console.log("err");
  });
}
module.exports = router;
