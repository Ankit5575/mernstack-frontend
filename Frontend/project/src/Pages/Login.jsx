import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    // Get redirect parameter
    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            const hasProducts = Array.isArray(cart?.products) && cart.products.length > 0;

            if (hasProducts && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/");
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/");
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="flex">
            {/* Left Side - Login Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm">
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium">Rabbit</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">Hey there! 🙋‍♂️</h2>
                    <p className="text-center mb-6">Enter your email and password to login</p>

                    {/* Display Error Message */}
                    {error && (
                        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            autoComplete="username"
                            className="w-full p-2 border rounded"
                            placeholder="Enter your email address"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            className="w-full p-2 border rounded"
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Sign In"}
                    </button>

                    {/* Register Link */}
                    <p className="mt-6 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
                            Register
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right Side - Image */}
            <div className="hidden md:block w-1/2 bg-gray-800">
                <div className="h-full flex flex-col justify-center items-center">
                    <img src={login} alt="Login to Account" className="h-[750px] w-full object-cover" />
                </div>
            </div>
        </div>
    );
}

export default Login;