import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');
  const conversationId = 1; // Hardcoded for demo; replace with dynamic ID
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUsername(decoded.sub || decoded.username || decoded.email); // Adjust based on token structure
    }

    // Fetch message history
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/chat/conversations/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Connect to WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);

    client.connect({}, () => {
      setConnected(true);
      client.subscribe(`/topic/conversation/${conversationId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages(prev => [...prev, receivedMessage]);
      });
    }, (error) => {
      console.error('WebSocket error:', error);
    });

    setStompClient(client);

    return () => {
      if (client) client.disconnect();
    };
  }, [conversationId]);

  const sendMessage = () => {
    if (stompClient && newMessage.trim() && username) {
      const messageRequest = {
        conversationId,
        messageContent: newMessage,
        senderUsername: username
      };
      stompClient.send('/app/chat.send', {}, JSON.stringify(messageRequest));
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <div className="flex-1 overflow-y-auto border p-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.senderUsername}:</strong> {msg.messageContent}
            <small className="text-gray-500 ml-2">{new Date(msg.createdAt).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-l"
          disabled={!connected}
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-500 text-white rounded-r"
          disabled={!connected}
        >
          Send
        </button>
      </div>
      {!connected && <p className="text-red-500 mt-2">Connecting...</p>}
    </div>
  );
};

export default Chat;
