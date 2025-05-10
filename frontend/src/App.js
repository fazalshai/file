import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const BASE_URL = 'https://file-x1wi.onrender.com'; // ✅ MAKE SURE THIS IS CORRECT

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/search-code">Search Code</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<UploadFile />} />
          <Route path="/search-code" element={<SearchCode />} />
        </Routes>
      </div>
    </Router>
  );
}

function UploadFile() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleNameChange = (e) => setName(e.target.value);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);

    try {
      setIsLoading(true);
      const response = await axios.post(`${BASE_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Swal.fire('Success!', `File uploaded! Random code: ${response.data.random_number}`, 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('Error!', error.response?.data?.error || 'Error uploading file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleFileUpload}>
        <input type="text" value={name} onChange={handleNameChange} placeholder="Enter name" required />
        <input type="file" onChange={handleFileChange} required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}

function SearchCode() {
  const [searchQuery, setSearchQuery] = useState('');
  const [file, setFile] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/search/${searchQuery}`);
      setFile(res.data);
    } catch {
      Swal.fire('Error!', 'File not found', 'error');
    }
  };

  return (
    <div>
      <h1>Search Code</h1>
      <input
        type="text"
        placeholder="Search by Random Number"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {file && (
        <div>
          <p>File Name: {file.fileName}</p>
          <p>Name: {file.name}</p>
          <p>Date: {new Date(file.date).toLocaleString()}</p>
          <a href={`${BASE_URL}/uploads/${file.fileName}`} target="_blank" rel="noreferrer">Download</a>
        </div>
      )}
    </div>
  );
}

export default App;
