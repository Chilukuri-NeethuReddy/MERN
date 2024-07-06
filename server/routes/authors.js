const express = require('express');
const router = express.Router();
const Author = require('../model/authorModel'); // Correct schema import
//const Book = require('../model/book'); 

// POST: Create a new book entry
router.post('/', async (req, res) => {
    try {
        const { _id, name, age, totalbooks,description } = req.body;
        const bookQuery = new Author({ _id, name, age, totalbooks,description });
        await bookQuery.save(); // Save the book to the database
        res.status(201).send({ message: "Author data entered" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// GET: Retrieve all books
router.get('/', async (req, res) => {
    try {
        const data = await Author.find();
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
        const updatedBook = await Author.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

        if (!updatedBook) {
            return res.status(404).send({ message: "Author not found" });
        }
        res.status(200).send({ message: "Author data updated successfully", updatedBook });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// DELETE: Delete a book entry
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Perform the delete operation
        const deletedBook = await Author.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).send({ message: "Author not found" });
        }
        res.status(200).send({ message: "Author data deleted successfully", deletedBook });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;