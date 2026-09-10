import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import service from "../appwrite/service";

export default function CreatePost() {
  const currentUser = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    location: "",
    cropName: "",
    price: "",
    quantity: "",
    caption: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please add a photo of the crop.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const uploaded = await service.uploadImage(file);
      await service.createPost({
        userId: currentUser.$id,
        userName: currentUser.name,
        imageId: uploaded.$id,
        ...form,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="font-display text-xl text-forest mb-4">Share a crop listing</h1>
      {error && <p className="text-sm text-clay mb-3">{error}</p>}
      <form onSubmit={submit} className="space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm"
          required
        />
        <input
          placeholder="Crop name (e.g. Javari Tomato)"
          value={form.cropName}
          onChange={update("cropName")}
          required
          className="w-full border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
        />
        <div className="flex gap-3">
          <input
            placeholder="Price per kg"
            value={form.price}
            onChange={update("price")}
            required
            className="w-1/2 border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
          />
          <input
            placeholder="Quantity (kg)"
            value={form.quantity}
            onChange={update("quantity")}
            required
            className="w-1/2 border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
          />
        </div>
        <input
          placeholder="Location (e.g. Nashik, Maharashtra)"
          value={form.location}
          onChange={update("location")}
          required
          className="w-full border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
        />
        <textarea
          placeholder="Caption (optional)"
          value={form.caption}
          onChange={update("caption")}
          className="w-full border border-line rounded-2xl px-4 py-2 text-sm outline-none focus:border-forest"
          rows={2}
        />
        <button
          disabled={loading}
          className="w-full bg-forest text-white rounded-full py-2 text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Posting..." : "Post listing"}
        </button>
      </form>
    </div>
  );
}
