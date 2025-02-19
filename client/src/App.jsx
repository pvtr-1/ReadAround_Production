import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
// import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorRegisterPage from './pages/DoctorRegisterPage';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/Admin';
import DoctorPanel from './pages/DoctorPanel';
import Profile from './pages/Profile';
import Recommendations from './pages/Recommendations';
import ResetPassword from './components/ResetPassword'
import BookPage from './pages/BookPage';
import BookAdd from './pages/BookAdd';
import ExploreBooks from './pages/ExploreBooks';
import BookReviewPage from './pages/BookReviewPage';
import ReviewDisplay from './pages/ReviewDisplay';
import UserProfilePage from './pages/UserProfilePage';
import FeedPage from './pages/FeedPage';
import BookUpdate from './pages/BookUpdate';
import UserRecommendBookPage from './pages/UserRecommedBookPage';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './pages/ProtectedRoute';

import { AuthProvider } from "./pages/AuthContext";
import { BlinkBlur } from 'react-loading-indicators';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an app loading process
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <BlinkBlur color="#3166cc" size="medium" text="Loading" />
      </div>
    );
  }

  return (
    
    <Router>
      <AuthProvider>
      <div className="bg-custom h-screen">
        {/* <Navbar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-doctor" element={<DoctorRegisterPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route path="/admin" element={<AdminPanel />} /> */}
          <Route path="/doctor" element={<DoctorPanel />} />

          {/* Admin Route - Restricted to Admins Only */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminPanel/>} />
            <Route path="/addbook" element={ <BookAdd />} />
            <Route path='/update-book' element={ <BookUpdate />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rec" element={<Recommendations />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/bookpage" element={ <BookPage />} />
            <Route path="/explore" element={ <ExploreBooks /> } />
            <Route path="/add-review" element={ <BookReviewPage /> } />
            <Route path="/view-reviews" element={ <ReviewDisplay /> } />
            <Route path="/view-user" element={ <UserProfilePage /> } />
            <Route path="/feed" element={<FeedPage />} />
            <Route path='/recommend_to_user' element={<UserRecommendBookPage />} />
          </Route>
        </Routes>
      </div>

    </AuthProvider>
    </Router>
  );
};

export default App;
