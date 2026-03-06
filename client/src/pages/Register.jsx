import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error("Please fill in all fields");
        if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
        setLoading(true);
        try {
            const res = await api.post("/api/auth/register", { ...form, role: "citizen" });
            const { user, token } = res.data.data;
            login(user, token);
            toast.success("Account created! Welcome to CivicSense.");
            navigate("/submit");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CS</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">CivicSense</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
                    <p className="text-sm text-gray-500 mt-2">Start filing complaints in minutes</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[
                            { label: "Full name", key: "name", type: "text", placeholder: "Bhushan Patil" },
                            { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
                            { label: "Password", key: "password", type: "password", placeholder: "Min. 6 characters" },
                        ].map(({ label, key, type, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
                                <input
                                    type={type}
                                    value={form[key]}
                                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                    placeholder={placeholder}
                                    className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                        ))}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Creating account...</>
                            ) : "Create account"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
