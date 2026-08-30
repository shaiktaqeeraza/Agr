import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import api from '../services/api';
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

const Chats = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  const preselectId = searchParams.get('userId');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await api.get('/messages/conversations');
        setConversations(data);
        if (preselectId) {
          const existing = data.find((c) => c.user._id === preselectId);
          if (existing) setActiveUser(existing.user);
          else {
            const { data: userData } = await api.get('/users');
            const found = userData.find((u) => u._id === preselectId);
            if (found) setActiveUser(found);
          }
        } else if (data.length > 0) {
          setActiveUser(data[0].user);
        }
      } catch (e) {
        // ignore
      }
    };
    fetchConversations();
  }, [preselectId]);

  useEffect(() => {
    if (!activeUser) return;
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${activeUser._id}`);
        setMessages(data);
      } catch (e) {
        // ignore
      }
    };
    fetchMessages();
  }, [activeUser]);

  useEffect(() => {
    const handler = (msg) => {
      if (activeUser && (msg.senderId === activeUser._id || msg.senderId?._id === activeUser._id)) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    socket.on('receiveMessage', handler);
    return () => socket.off('receiveMessage', handler);
  }, [activeUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeUser) return;
    try {
      const { data } = await api.post('/messages', { receiverId: activeUser._id, message: text });
      setMessages((prev) => [...prev, data]);
      setText('');
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="card flex h-[75vh] overflow-hidden">
        <div className="w-full sm:w-72 border-r border-crop-100 overflow-y-auto">
          <div className="p-4 font-display font-semibold text-crop-800 border-b border-crop-100">Chats</div>
          {conversations.length === 0 && (
            <p className="text-sm text-crop-400 p-4">No conversations yet. Message a farmer from the feed to start chatting.</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.user._id}
              onClick={() => setActiveUser(c.user)}
              className={`w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-crop-50 ${
                activeUser?._id === c.user._id ? 'bg-crop-50' : ''
              }`}
            >
              <img
                src={c.user.profileImage || `https://ui-avatars.com/api/?background=3a9457&color=fff&name=${encodeURIComponent(c.user.name)}`}
                alt={c.user.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="font-medium text-sm text-crop-900 truncate">{c.user.name}</p>
                <p className="text-xs text-crop-400 truncate">{c.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="hidden sm:flex flex-col flex-1">
          {activeUser ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-crop-100">
                <img
                  src={activeUser.profileImage || `https://ui-avatars.com/api/?background=3a9457&color=fff&name=${encodeURIComponent(activeUser.name)}`}
                  alt={activeUser.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <p className="font-medium text-crop-900">{activeUser.name}</p>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-wheat/40">
                {messages.map((m) => {
                  const mine = (m.senderId?._id || m.senderId) === user.id;
                  return (
                    <div key={m._id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${mine ? 'bg-crop-600 text-white' : 'bg-white text-crop-900 border border-crop-100'}`}>
                        <p>{m.message}</p>
                        <p className={`text-[10px] mt-1 ${mine ? 'text-crop-100' : 'text-crop-400'}`}>
                          {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t border-crop-100">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary p-2.5 rounded-full">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-crop-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
