import { useEffect, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const UserRecommendBookPage = ({  }) => {
  const [followers, setFollowers] = useState([]);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user_id = localStorage.getItem("user_id");
  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const followersRes = await axios.get(`https://readaround.onrender.com:7000/api/social/${user_id}/followers`);
        const followerIds = followersRes.data.data.map((item) => item.follower);

        const userPromises = followerIds.map((id) =>
          axios.get(`https://readaround.onrender.com:7000/api/user/details?id=${id}`)
        );
        const users = await Promise.all(userPromises);

        const userMap = users.map((res) => ({
          id: res.data.user.id,
          username: res.data.user.username,
        }));

        setFollowers(userMap);
      } catch (error) {
        console.error("Failed to fetch followers", error);
        setError("Failed to load followers");
      } finally {
        setLoading(false);
      }
    };

    fetchSocialData();
  }, [user_id]);

  const handleBookSearch = async (term) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await axios.get(`https://readaround.onrender.com:7000/api/books/search?title=${term}`);
      setSearchResults(res.data.books);
    } catch (err) {
      console.error("Failed to search books", err);
    }
  };

  const handleRecommendBook = async () => {
    if (!selectedFollower || !selectedBook) {
      alert("Please select a follower and a book.");
      return;
    }

    try {
      await axios.post("https://readaround.onrender.com:7000/api/recommend/recommend", {
        from_user: user_id,
        to_user: selectedFollower.id,
        book_id: selectedBook.id,
      });

      alert(`Book "${selectedBook.title}" recommended to ${selectedFollower.username}!`);
      setSelectedFollower(null);
      setSelectedBook(null);
      setSearchTerm("");
      setSearchResults([]);
    } catch (error) {
      console.error("Failed to recommend book", error);
      alert("Failed to recommend book.");
    }
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Recommend a Book</h1>

      {/* Followers List */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-2">Select a Follower:</h2>
        {loading ? (
          <p>Loading followers...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white text-black rounded-lg p-3">
            {followers.map((follower) => (
              <div
                key={follower.id}
                className={`p-2 cursor-pointer rounded-lg ${
                  selectedFollower?.id === follower.id ? "bg-gray-300" : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedFollower(follower)}
              >
                {follower.username}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Book Search */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold mb-2">Search for a Book:</h2>
        <input
          type="text"
          className="w-full p-3 bg-gray-600 rounded-lg text-black"
          placeholder="Search for books..."
          value={searchTerm}
          onChange={(e) => handleBookSearch(e.target.value)}
        />
        {searchResults.length > 0 && (
          <div className="bg-white text-black rounded-lg mt-2 p-2 max-h-60 overflow-y-auto shadow-lg">
            {searchResults.map((book) => (
              <div
                key={book._id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() =>{
                
                 setSelectedBook(book);
                setSearchResults([]);
                }
                }    
              >
                {book.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Book Display */}
      {selectedBook && (
        <div className="mb-5">
          <h2 className="text-xl font-semibold mb-2">Selected Book:</h2>
          <BookCard book={selectedBook} />
        </div>
      )}

      {/* Recommend Button */}
      <button
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        onClick={handleRecommendBook}
      >
        Recommend Book
      </button>
    </div>
  );
};

export default UserRecommendBookPage;
