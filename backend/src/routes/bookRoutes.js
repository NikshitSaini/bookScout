import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js";
import ProtectRoute from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/", ProtectRoute, async (req, res) => {
    try {
        const { title, rating, image, caption } = req.body;

        // console.log("DEBUG: Received body:", req.body); // DEBUG LOG
        // console.log("DEBUG: Fields check - title:", !!title, "rating:", !!rating, "image:", !!image, "caption:", !!caption); // DEBUG LOG

        if (!title || !rating || !image || !caption) {
            return res.status(400).json({ message: "All fields are required", received: { title: !!title, rating: !!rating, image: !!image, caption: !!caption } });
        }

        const UploadRes = await cloudinary.uploader.upload(image);
        const UploadUrl = UploadRes.secure_url;

        const newBook = new Book({
            title,
            caption, // Matches schema now
            rating,
            image: UploadUrl,
            user: req.user._id
            // Removed author here
        });

        await newBook.save();
        res.status(201).json(newBook);

    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/", ProtectRoute, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentpage: page,
            totalbooks: totalBooks,
            totalBooksPages: Math.ceil(totalBooks / limit)
        });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// get by user 
router.get("/user", ProtectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.user._id })
            .sort({ createdAt: -1 })
        res.json(books);
    } catch (error) {
        console.error("Error fetching user's books:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// get by user id
router.get("/user/:userId", ProtectRoute, async (req, res) => {
    try {
        const books = await Book.find({ user: req.params.userId })
            .sort({ createdAt: -1 })
        res.json(books);
    } catch (error) {
        console.error("Error fetching user's books:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:id", ProtectRoute, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (book.image && book.image.includes("res.cloudinary.com")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);

            }
        }
        
        // Use findByIdAndDelete instead of remove() (remove is deprecated in newer Mongoose versions)
        await Book.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Book removed successfully" });
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;