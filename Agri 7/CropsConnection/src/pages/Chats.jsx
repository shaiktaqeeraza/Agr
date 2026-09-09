import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import service from "../appwrite/service";

export default function Chats() {
  const currentUser = useSelector((state) => state.auth.userData);
  const [params] = useSearchParams();
  const otherId = params.get("with");
  const otherName = params.get("name") || "Farmer";
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (currentUser && otherId) {
      service.getConversation(currentUser.$id, otherId).then(setMessages);
    }
  }, [currentUser, otherId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !otherId) return;
    const msg = await service.sendMessage({
      senderId: currentUser.$id,
      receiverId: otherId,
      text,
    });
    setMessages((m) => [...m, msg]);
    setText("");
  };

  if (!otherId) {
    return (
      <div className="max-w-md mx-auto px-4 py-10 text-center text-soil/50 text-sm">
        Tap "Message" on a post in the Feed to start a conversation.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col h-[calc(100vh-140px)]">
      <h1 className="font-display text-lg text-forest mb-3">{otherName}</h1>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((m) => (
          <div
            key={m.$id}
            className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
              m.senderId === currentUser.$id
                ? "bg-forest text-white ml-auto"
                : "bg-white border border-line"
            }`}
          >
            {m.text}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-sm text-soil/50 text-center py-6">Say hello to {otherName}.</p>
        )}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
        />
        <button className="bg-forest text-white rounded-full px-4 text-sm font-medium">Send</button>
      </form>
    </div>
  );
}
