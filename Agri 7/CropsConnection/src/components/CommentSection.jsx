import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import service from "../appwrite/service";

export default function CommentSection({ postId }) {
  const currentUser = useSelector((state) => state.auth.userData);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    service.getComments(postId).then((res) => setComments(res.documents));
  }, [postId]);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentUser) return;
    const doc = await service.addComment({
      postId,
      userId: currentUser.$id,
      userName: currentUser.name,
      text,
    });
    setComments((c) => [...c, doc]);
    setText("");
  };

  return (
    <div className="border-t border-line px-4 py-3 bg-cream/60">
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map((c) => (
          <p key={c.$id} className="text-sm">
            <span className="font-medium">{c.userName}</span>{" "}
            <span className="text-soil/80">{c.text}</span>
          </p>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-soil/50">No comments yet.</p>
        )}
      </div>
      {currentUser && (
        <form onSubmit={submit} className="flex gap-2 mt-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-white border border-line rounded-full px-3 py-1.5 outline-none focus:border-forest"
          />
          <button type="submit" className="text-sm text-forest font-medium">
            Post
          </button>
        </form>
      )}
    </div>
  );
}
