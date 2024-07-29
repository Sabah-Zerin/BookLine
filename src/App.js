import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';

import { Book } from './book';
import Home from './Home';
import SearchPage from './SearchPage';
import { AuthProvider, useAuth } from './AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword'; // Import ForgotPassword
import UserProfile from './pages/UserProfile';

import FavoritesScreen from './FavoritesScreen'; 
import AboutUs from './AboutUs'; 
import ContactUs from './ContactUs';

import searchBgImage from './images/search-page-bg.jpg';

const initialBooks = JSON.parse(localStorage.getItem('books')) || Book;

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} />
  );
};

function App() {
  const [books, setBooks] = useState(initialBooks);
  const [query, setQuery] = useState("");

  const [searchType, setSearchType] = useState("name"); // Add search type state

  const [showFavoritesScreen, setShowFavoritesScreen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  useEffect(() => {
    const bgImg = new Image();
    bgImg.src = searchBgImage;
    bgImg.onload = () => setBgLoaded(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  const handleFavouriteClick = (id) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, isFavourite: !book.isFavourite } : book
      )
    );
  };

  const toggleFavoritesScreen = () => {
    setShowFavoritesScreen(!showFavoritesScreen);
  };

  const handleDeleteFavorite = (id) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === id ? { ...book, isFavourite: false } : book
      )
    );
  };

  const handleAddBook = (newBookObj) => {
    setBooks([newBookObj, ...books]);
  };

  const handleEditClick = (id) => {
    const bookToEdit = books.find(book => book.id === id);
    setEditBook(bookToEdit);
  };

  const handleSaveEdit = (editedBook) => {
    setBooks(prevBooks =>
      prevBooks.map(book =>
        book.id === editedBook.id ? editedBook : book
      )
    );
    setEditBook(null);
  };

  const handleCancelEdit = () => {
    setEditBook(null);
  };

  const deleteBook = (id) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
  };

  // Update filteredBooks to handle search type
  const filteredBooks = books.filter(book => {
    if (searchType === "name") {
      return book.Name.toLowerCase().includes(query.toLowerCase());
    } else if (searchType === "writer") {
      return book.Writer.toLowerCase().includes(query.toLowerCase());
    }
    return false;
  });

  const favoriteBooks = books.filter(book => book.isFavourite);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search"element={
                <ProtectedRoute>
                  
                  <SearchPage
                    books={books}
                    query={query}
                    setQuery={setQuery}

                    searchType={searchType} // Pass searchType as prop
                    setSearchType={setSearchType} // Pass setSearchType as prop

                    showAddForm={showAddForm}
                    toggleAddForm={toggleAddForm}
                    addBook={handleAddBook}
                    editBook={editBook}
                    saveEdit={handleSaveEdit}
                    cancelEdit={handleCancelEdit}
                    filteredBooks={filteredBooks}
                    favoriteBooks={favoriteBooks}

                    showFavoritesScreen={showFavoritesScreen}
                    
                    toggleFavoritesScreen={toggleFavoritesScreen}
                    handleFavouriteClick={handleFavouriteClick}
                    handleDeleteFavorite={handleDeleteFavorite}
                    handleEditClick={handleEditClick}
                    deleteBook={deleteBook}
                  />
               </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <FavoritesScreen
                  books={favoriteBooks}
                  handleEditClick={handleEditClick}
                  handleDeleteFavorite={handleDeleteFavorite}
                />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
                </ProtectedRoute>
              } />
             <Route path='/aboutus' element={<AboutUs />} /> 
             <Route path='/contactus' element={<ContactUs />} />
            <Route path='/login' element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add route */}
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
