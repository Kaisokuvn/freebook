const express = require("express");
const Author = require("../models/author");

const router = express.Router();

router.get("/", async (req, res) => {
  let searchOption = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOption.name = new RegExp(req.query.name, "i"); //không phân biệt in hoa  hay viết thường
  }
  try {
    const authors = await Author.find(searchOption);
    res.render("authors/index", { authors: authors, searchOption: req.query });
  } catch (error) {
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

router.post("/new", async (req, res) => {
  const newAuthor = new Author({
    name: req.body.name,
  });

  try {
    const createdAuthor = await newAuthor.save();
    //res.redirect(`authors/${createdAuthor.id}`);
    res.redirect("/authors");
  } catch (error) {
    res.render("authors/new", {
      author: author,
      errorMessage: "Error created Author",
    });
  }
});
module.exports = router;
