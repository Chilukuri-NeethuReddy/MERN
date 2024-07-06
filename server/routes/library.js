const express = require('express');
const router = express.Router();
const Book = require('../model/bookModel');
const Author = require('../model/authorModel');

// GET: Retrieve all books with associated authors
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();

        if (!books || books.length === 0) {
            return res.status(404).send({ message: "No books found" });
        }

        let booksWithAuthors = [];

        for (let book of books) {
            const author = await Author.findById(book.author_id);

            if (!author) {
                console.log(`Author not found for book ${book.name}`);
            } else {
                const bookWithAuthor = {
                    _id: book._id,
                    name: book.name,
                    publisher: book.publisher,
                    description: book.description,
                    author: {
                        _id: author._id,
                        name: author.name,
                        totalbooks: author.totalbooks
                    }
                };
                booksWithAuthors.push(bookWithAuthor);
            }
        }

        // Send the response with the populated books array
        res.status(200).send(booksWithAuthors);

    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports = router;