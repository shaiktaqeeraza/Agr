import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const { userId } = useParams();
  const { user, socket } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    api.get('/chat/conversations').then((res) => setConversations(res.data.conversations));
  }, [userId]);

  useEffect(() => {
    if (userId) {
      api.get(`/chat/${userId}`).then((res) => setMessages(res.data.messages));
      api.get(`/users/${userId}`).then((res) => setActiveUser(res.data.user));
    }
  }, [userId]);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if (msg.sender === userId || msg.receiver === userId) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('newMessage', handler);
    return () => socket.off('newMessage', handler);
  }, [socket, userId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await api.post(`/chat/${userId}`, { text });
    setMessages((prev) => [...prev, res.data.message]);
    setText('');
  };

  return (
    <div className="page-container grid md:grid-cols-3 gap-6 h-[calc(100vh-160px)]">
      <div className="card p-3 overflow-y-auto">
        <h2 className="font-semibold text-gray-800 px-2 mb-2">Conversations</h2>
        {conversations.map((c) => (
          <Link
            key={c.user._id}
            to={`/chat/${c.user._id}`}
            className={`flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 ${userId === c.user._id ? 'bg-primary-50' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-700">
              {c.user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-800 truncate">{c.user.name}</p>
              <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
            </div>
            {c.unread > 0 && <span className="bg-primary-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">{c.unread}</span>}
          </Link>
        ))}
        {conversations.length === 0 && <p className="text-gray-400 text-sm p-3">No conversations yet. Start chatting from a crop listing.</p>}
      </div>

      <div className="md:col-span-2 card flex flex-col">
        {userId ? (
          <>
            <div className="p-4 border-b border-gray-100 font-semibold text-gray-800">
              {activeUser?.name || 'Chat'}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === (user.id || user._id) ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${m.sender === (user.id || user._id) ? 'bg-primary-600 text-white' : 'bg-primary-50 text-gray-800'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 flex gap-2">
              <input className="input-field flex-1" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
              <button className="btn-primary">Send</button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation to start chatting</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
