import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    authService.getCurrentUser().then((userData) => {
      if (userData) navigate("/", { replace: true });
    });
  }, [navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.createAccount({ email, password, name });
      const userData = await authService.getCurrentUser();
      if (userData) dispatch(login({ userData }));
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm border border-line rounded-2xl bg-white p-6">
        <h1 className="font-display text-2xl text-forest mb-1">CropsConnection</h1>
        <p className="text-sm text-soil/60 mb-6">Create your account</p>
        {error && <p className="text-sm text-clay mb-3">{error}</p>}
        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-forest"
          />
          <button className="w-full bg-forest text-white rounded-full py-2 text-sm font-medium">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-soil/60 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-forest font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
