import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: message
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Failed to get response from server');
    }
    
    setLoading(false);
  };

  // Function to format the AI response with proper HTML
  const formatResponse = (text) => {
    if (!text) return '';
    
    // Convert **bold** to <strong>
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert numbered lists
    formattedText = formattedText.replace(/(\d+\.\s.*)/g, '<li>$1</li>');
    
    // Convert YouTube links to clickable links
    formattedText = formattedText.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">Watch Video</a>');
    
    // Add line breaks for better readability
    formattedText = formattedText.replace(/\n/g, '<br />');
    
    return { __html: formattedText };
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🍳 Smart Cooking Assistant</h1>
        <p>Your personal AI chef for recipes and cooking tips</p>
      </header>
      
      <form onSubmit={handleSubmit} className="chat-form">
        <div className="input-group">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What ingredients do you have? Ask me anything about cooking..."
            disabled={loading}
            className="message-input"
          />
          <button type="submit" disabled={loading || !message.trim()} className="submit-btn">
            {loading ? '👨‍🍳 Cooking...' : 'Ask Chef'}
          </button>
        </div>
      </form>

      {response && (
        <div className="response-container">
          <div className="response-header">
            <h3>👨‍🍳 Chef's Recommendation</h3>
          </div>
          <div 
            className="response-content"
            dangerouslySetInnerHTML={formatResponse(response)}
          />
        </div>
      )}
    </div>
  );
}

export default App;