import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import chatbotApi from '../api/chatbot';
import { showSuccess, showError } from '../utils/toast';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your MyMech assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestions = [
    "Book Appointment",
    "Track Service",
    "Service Hours",
    "Contact Support"
  ];

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send to chatbot API
      const response = await chatbotApi.query({ query: inputValue });
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response || "I'm sorry, I didn't understand that. Can you please rephrase?",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Show success notification for certain queries
      if (inputValue.toLowerCase().includes('book') || inputValue.toLowerCase().includes('appointment')) {
        showSuccess('I can help you book an appointment!');
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      showError('Failed to connect to chatbot. Please try again later.');
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-widget">
      {isOpen ? (
        <div className="chatbot-container card shadow-lg">
          {/* Chat Header */}
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <FaRobot className="me-2" />
              <h5 className="mb-0">MyMech Assistant</h5>
            </div>
            <button 
              className="btn btn-sm btn-light"
              onClick={toggleChat}
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages p-3 overflow-auto" style={{ height: '300px' }}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message mb-3 ${message.sender === 'user' ? 'text-end' : 'text-start'}`}
              >
                <div 
                  className={`d-inline-block p-2 rounded ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white' 
                      : 'bg-light text-dark'
                  }`}
                  style={{ maxWidth: '80%' }}
                >
                  <div>{message.text}</div>
                  <small className="text-muted">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message mb-3 text-start">
                <div className="d-inline-block p-2 rounded bg-light text-dark">
                  <FaSpinner className="fa-spin me-1" />
                  Typing...
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {!isLoading && messages.length === 1 && (
            <div className="px-3 py-2 border-top border-bottom">
              <small className="text-muted d-block mb-2">Quick suggestions:</small>
              <div className="d-flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="card-footer p-2">
            <form onSubmit={handleSubmit} className="d-flex">
              <input
                type="text"
                className="form-control"
                placeholder="Type your message..."
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="btn btn-primary ms-2"
                disabled={isLoading || !inputValue.trim()}
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button 
          className="btn btn-primary rounded-circle chatbot-toggle"
          onClick={toggleChat}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            zIndex: 1000
          }}
        >
          <FaRobot size={24} />
        </button>
      )}

      <style jsx>{`
        .chatbot-container {
          position: fixed;
          bottom: 90px;
          right: 20px;
          width: 350px;
          z-index: 1000;
          max-height: 500px;
        }
        
        .chat-messages {
          display: flex;
          flex-direction: column;
        }
        
        @media (max-width: 576px) {
          .chatbot-container {
            width: calc(100% - 40px);
            right: 20px;
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatbotWidget;