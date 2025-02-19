const express = require("express");

const router = express.Router();
const Book = require("../models/bookModel");


// get a book using specific filters that are passed from the frontend.
router.post("/get", async (req, res) => {
    const { title, author , genre } = req.body;
    if (genre){
        const response =  await Book.find({ genre : genre });
        if(!response)
        {
            return res.status(400).json({ message : "Searched genre does not found" })
        }
        else
        {
            console.log(response);
            return res.status(200).json({ message : "Success", 
                response : 
                    response.map( response => ({
                        id : response._id,
                        title : response.title,
                        genre : response.genre,
                        cover_image : response.cover_image,
                        publication_date : response.publication_date,
                        number_of_reviews: response.number_of_reviews,
                        average_rating: response.average_rating,
                        author: response.author
                    }) )
                
            })
        }
    }

});

router.get("/search", async (req, res) => {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: "Title is required for search" });
    }
  
    try {
      const response = await Book.find({ title: new RegExp(title, "i") }); // Case-insensitive title search
  
      if (!response.length) {
        return res.status(404).json({ message: "No books found with the given title" });
      }
  
      return res.status(200).json({
        message: "Success",
        books: response.map((book) => ({
          id: book._id,
          title: book.title,
          genre: book.genre,
          cover_image: book.cover_image,
          publication_date: book.publication_date,
          number_of_reviews: book.number_of_reviews,
          average_rating: book.average_rating,
          author: book.author,
        })),
      });
    } catch (error) {
      console.error("Search error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  

// return a book specified by the id.
router.get("/:id",async (req,res) => {
    const book_id = req.params.id;
    console.log(book_id);
    
    const response = await Book.findOne({ _id: book_id });
    if(!response)
        {
            return res.status(400).json({ message : "Searched book with id does not found" })
        }
        else
        {
            console.log(response);
            return res.status(200).json({ message : "Success", 
                data : {
                    id : response._id,
                    title : response.title,
                    genre : response.genre,
                    cover_image : response.cover_image,
                    publication_date : response.publication_date,
                    number_of_reviews: response.number_of_reviews,
                    average_rating: response.average_rating,
                    author: response.author

                }
                
            })
        }
});


// add a book to the responsebase ( admin only )
router.post("/add", async (req, res) => {
   const { title , author, genre, description, publication_date, cover_image, imageFile, fileupload } = req.body;

   console.log(title,author,genre,description,fileupload);
   if (!title || !author || !genre || !description) {
        return res.status(400).json({ message: "All required fields must be provided." });
    }

   if (!fileupload)
    {
        console.log("hi");
        console.log(imageFile);
    }
    else
    {
        try
        {

            const existingBook = await Book.findOne({title });
            if (existingBook) {
                return res.status(400).json({ message : "Book already added" });
            }

            const newBook = new Book({
                title : title,
                author : author,
                genre : genre,
                description : description,
                cover_image : cover_image,
                publication_date : publication_date
            });
    
            await newBook.save()
    
            res.status(201).json({ message : " Book registered successfully ", book : newBook});
        }
        catch(error) {
            console.error("Error during book registration : ", error);
            res.status(500).json({ message : "server error", error_message : `${error}` });
        }
    }
});











// update a book information ( admin only )

router.put("/:id", async (req, res) => {
    const bookId = req.params.id;
    const updateFields = {};
    
    Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined && req.body[key] !== null) {
            updateFields[key] = req.body[key];
        }
    });

    try {
        const response = await Book.updateOne(
            { _id: bookId }, // Find the book by its ID
            { $set: updateFields }
        );

        if (response.matchedCount === 0) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", response });
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).json({ message: "Error updating book", error });
    }
});




// delete a book entirely from the responsebase. ( admin only )

router.delete("/:id", async (req, res) => {
    const bookId = req.params.id;

    try {
        const deletedBook = await Book.findByIdAndDelete(bookId);

        if (!deletedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;