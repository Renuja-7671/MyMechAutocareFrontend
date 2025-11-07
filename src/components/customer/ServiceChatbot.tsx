import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { chatbotService, ChatbotMessage } from '../../services/chatbot';
import { toast } from 'sonner';

interface ServiceChatbotProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ServiceChatbot = ({ open, onOpenChange }: ServiceChatbotProps = {}) => {
  // Use internal state if not controlled by parent
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalIsOpen;

  const [messages, setMessages] = useState<ChatbotMessage[]>([
    {
      id: 1,
      text: "Hello! I'm your automobile service assistant. I can help you find available appointment slots. Just let me know when you'd like to schedule a service!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    const newState = !isOpen;
    if (isControlled && onOpenChange) {
      onOpenChange(newState);
    } else {
      setInternalIsOpen(newState);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;

    // Add user message to chat
    const userMessage: ChatbotMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call backend chatbot API through service
      const response = await chatbotService.sendMessage(messageToSend);

      if (response.success) {
        const { reply, availableSlots, date, intent } = response.data;

        // Add bot response to chat
        const botMessage: ChatbotMessage = {
          id: messages.length + 2,
          text: reply,
          sender: 'bot',
          timestamp: new Date(),
          data: {
            intent,
            availableSlots,
            date,
          },
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Handle error response
        const errorMessage: ChatbotMessage = {
          id: messages.length + 2,
          text: response.error || "I'm sorry, I'm having trouble processing your request right now.",
          sender: 'bot',
          timestamp: new Date(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
        toast.error(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: ChatbotMessage = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
        }}
        className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
        }`}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '1.5rem',
            zIndex: 9999,
          }}
          className="w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 transition-all duration-300 animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Service Assistant</h3>
                <p className="text-blue-100 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : message.isError
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-bl-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>

                  {/* Display available slots if present */}
                  {message.data?.availableSlots && message.data.availableSlots.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
                      <p className="text-xs font-semibold mb-2">Available Slots:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.data.availableSlots.map((slot, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className={`text-xs mt-2 block ${
                    message.sender === 'user' ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <span
                        className="w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse"
                        style={{ animationDelay: '0ms', animationDuration: '1s' }}
                      ></span>
                      <span
                        className="w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse"
                        style={{ animationDelay: '200ms', animationDuration: '1s' }}
                      ></span>
                      <span
                        className="w-2.5 h-2.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-pulse"
                        style={{ animationDelay: '400ms', animationDuration: '1s' }}
                      ></span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 animate-pulse">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:scale-105 active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ServiceChatbot;
