// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ReviewCard from "../components/ReviewCard"; // Ensure this is the correct path to your ReviewCard component
// import { useLocation } from "react-router-dom";

// const ReviewDisplay = () => {
//   const [reviews, setReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user_id, setId] = useState("");
//   const [user_data, setUser] = useState({ 
//     id: "",
//     username: "",
//     email: "",
//     phone: ""
//    })
//   const location = useLocation();
//   const { book_id , book_title} = location.state || {};

//   console.log(book_title,book_id);
//   // Fetch reviews from the backend
//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get("http://127.0.0.1:7000/api/review/get?bid="+book_id); // Replace with your backend endpoint
//         setReviews(response.data.data);
//         console.log(reviews);
//       } catch (err) {
//         setError("Failed to load reviews. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchReviews();
//   }, []);

//   if (loading) {
//     return <div className="text-center text-gray-500 mt-10">Loading reviews...</div>;
//   }

//   if (error) {
//     return <div className="text-center text-red-500 mt-10">{error}</div>;
//   }

//   return (
//     <div className="bg-gray-900 min-h-screen py-10 px-5">
//       <h1 className="text-3xl font-bold text-white text-center mb-10">{ book_title }</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {reviews.map((review, index) => (
//           <ReviewCard key={index} review={review} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ReviewDisplay;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import ReviewCard from "../components/ReviewCard"; // Ensure correct path

const ReviewDisplay = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { book_id, book_title } = location.state || {};

  useEffect(() => {
    if (!book_id) {
      setError("Book ID is missing. Cannot fetch reviews.");
      setLoading(false);
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`https://readaround.onrender.com:6000/api/review/get?bid=${book_id}`);
        setReviews(response.data.data || []);
      } catch (err) {
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [book_id]);

  const handleVote = async (reviewId, type) => {
    try {
      const response = await axios.post(`https://readaround.onrender.com:6000/api/review/${reviewId}/${type}`, {
        user_id: localStorage.getItem("user_id") // Replace with actual user ID
      });
      
      setReviews(reviews.map(review => 
        review._id === reviewId ? { ...review, upvotes: response.data.review.upvotes, downvotes: response.data.review.downvotes } : review
      ));
    } catch (error) {
      console.error(`Failed to ${type} the review`, error);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen py-10 px-5">
      <h1 className="text-3xl font-bold text-white text-center mb-10">{book_title || "Book Reviews"}</h1>
      <div className="flex justify-center gap-4 mb-6">


      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.review_id} className="bg-gray-800 p-5 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-2">
                <div className="text-green-400 flex items-center gap-1">
                  <button onClick={() => handleVote(review.review_id, "upvote")} className="flex items-center gap-1 text-green-400 text-lg">
                      <ArrowBigUp /> {reviews.reduce((sum, r) => sum + (r.upvotes || 0), 0)}
                  </button>
                </div>
                <div className="text-red-400 flex items-center gap-1">
                    <button onClick={() => handleVote(review.review_id, "downvote")} className="flex items-center gap-1 text-red-400 text-lg">
                        <ArrowBigDown /> {reviews.reduce((sum, r) => sum + (r.downvotes || 0), 0)}
                    </button>
                </div>
              </div>
              <ReviewCard review={review} onVote={handleVote} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 col-span-full">No reviews available for this book.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewDisplay;

