const mongoose = require("mongoose");
const path = require("path")

const coverImageBasePath = "uploads/bookcovers"
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  publishDate: {
    type: Date,
    required: true,
  },
  pageCount: {
    type: Number,
    required: true,
  },
  createAt:{
      type: Date,
      required: true,
      default: Date.now
  },
  coverImageName:{
    type: String,
    required: true
  }, author:{
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Author"
  }
});
bookSchema.virtual('coverImagePath').get(function(){
  //use this for this function
  if(this.coverImageName != null){
    return path.join("/", coverImageBasePath, this.coverImageName);
  }
}); 
const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
module.exports.coverImageBasePath = coverImageBasePath;