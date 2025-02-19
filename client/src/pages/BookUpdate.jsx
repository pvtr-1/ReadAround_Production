import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const BookUpdate = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publication_date: "",
    imageLink: "",
  });
  const [selectedBook, setSelectedBook] = useState(null);


  const handleSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await axios.get(`https://readaround.onrender.com:6000/api/books/search?title=${term}`);
      setSearchResults(res.data.books);
    } catch (err) {
      setError("Failed to search books");
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchBooks(searchTerm.toLowerCase());
      } else {
        setBooks([]);
      }
    }, 500); // Debounce delay

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const fetchBooks = async (term) => {
    try {
      const res = await axios.get(`https://readaround.onrender.com:6000/api/books/search?title=${term}`);
      setBooks(res.data);
    } catch (error) {
      console.error("Error searching books:", error);
    }
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      publication_date: book.publication_date,
      imageLink: book.imageLink || "",
    });
    setBooks([]); // Clear search results
    setSearchTerm(""); // Reset search input
    setSearchResults([]);  
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBook) return;

    try {
      await axios.put(`https://readaround.onrender.com:6000/api/books/${selectedBook.id}`, formData);
      alert("Book updated successfully!");
      setSelectedBook(null);
      setFormData({ title: "", author: "", genre: "", description: "", publication_date: "", imageLink: "" });
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Failed to update book.");
    }
  };

  const handleDelete = async () => {
    if (!selectedBook) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://readaround.onrender.com:6000/api/books/${selectedBook.id}`);
      alert("Book deleted successfully!");
      setSelectedBook(null);
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book.");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-100">Update or Delete a Book</h2>

        {/* Search Section */}
        <div className="mb-5">
          <input
            type="text"
            className="w-full p-3 bg-gray-600 rounded-lg text-white"
            placeholder="Search for books..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="bg-white text-black rounded-lg mt-2 p-2 max-h-60 overflow-y-auto shadow-lg">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectBook(book) }
                >
                  {book.title} by {book.author}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Display Selected Book */}
        {selectedBook && (
          <div className="mb-6">
            <BookCard book={selectedBook} />
            <div className="flex space-x-4 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => setSelectedBook(selectedBook)}
              >
                Edit Book
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete Book
              </button>
            </div>
          </div>
        )}

        {/* Book Edit Form */}
        {selectedBook && (
          <form onSubmit={handleUpdate} className="mt-6">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
              required
            />
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
              rows="4"
            ></textarea>
            <input
              type="date"
              name="publication_date"
              value={formData.publication_date}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
            />
            <input
              type="text"
              name="imageLink"
              value={formData.imageLink}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-2 border rounded-lg dark:bg-gray-700 dark:text-gray-100"
              placeholder="Image URL"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-500 dark:bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 dark:hover:bg-green-800"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookUpdate;
