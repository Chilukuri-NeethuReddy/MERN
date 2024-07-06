
const express = require('express');
const router = express.Router();
const Book = require('../model/bookModel'); // Correct schema import
const Author = require('../model/authorModel');

// POST: Create a new book entry
router.post('/', async (req, res) => {
    try {
        const { _id, name, publisher, description, author_id } = req.body;
        const bookQuery = new Book({ _id, name, publisher, description, author_id });
        await bookQuery.save(); // Save the book to the database
        
        
       const auth = await Author.findById(author_id)
       if(!auth) {
        return req.status(404).send({ message: "Author not found" })
       }
       auth.totalbooks+=1;
       await auth.save(); 
                

        res.status(201).send({ message: "Book data entered" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// GET: Retrieve all books
router.get('/', async (req, res) => {
    try {
        const data = await Book.find();
        res.status(200).send(data); // Status code should be 200 for a successful GET request
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// PUT: Update book data
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Capture all fields to be updated from request body

        // Perform the update
        const updatedBook = await Book.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

        if (!updatedBook) {
            return res.status(404).send({ message: "Book not found" });
        }
        res.status(200).send({ message: "Book data updated successfully", updatedBook });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// DELETE: Delete a book entry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Perform the delete operation
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).send({ message: "Book not found" });
        }
        res.status(200).send({ message: "Book data deleted successfully", deletedBook });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;