import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, LogIn, ShieldCheck, Zap, Globe } from "lucide-react";
import { validateEmail } from "@/lib/validation";
import Logger from "@/lib/logger";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      toast.error("❌ Please fix the errors below");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      
      if (result.success) {
        toast.success("✅ Welcome back to storeMX!");
        Logger.info(`User logged in: ${email}`);
        
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }
        navigate("/");
      } else {
        toast.error(`❌ ${result.error || "Login failed. Please try again."}`);
        Logger.warn("Login attempt failed", { email });
      }
    } catch (error) {
      Logger.error("Login error", error);
      toast.error("❌ An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-600 via-slate-700 to-gray-700 text-white px-8 py-12 flex-col items-center justify-center relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

        {/* Logo & Brand - Centered */}
        <div className="relative z-10 text-center mb-12">
          <div className="flex flex-col items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <span className="text-4xl">🛍️</span>
            </div>
            <h2 className="text-4xl font-bold">storeMX</h2>
          </div>
          <p className="text-sky-50 text-base">Your Premier Online Shopping Destination</p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-5 w-full max-w-sm">
          <div className="flex gap-4 items-start group hover:bg-white/5 p-4 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur group-hover:bg-white/35 transition-colors duration-300 shadow-lg">
              <Zap className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">⚡ Fast Checkout</h3>
              <p className="text-sky-50 text-sm leading-relaxed">Complete your purchase in just a few seconds</p>
            </div>
          </div>

          <div className="flex gap-4 items-start group hover:bg-white/5 p-4 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur group-hover:bg-white/35 transition-colors duration-300 shadow-lg">
              <ShieldCheck className="w-6 h-6 text-green-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">🔒 100% Secure</h3>
              <p className="text-sky-50 text-sm leading-relaxed">Your data is encrypted and fully protected</p>
            </div>
          </div>

          <div className="flex gap-4 items-start group hover:bg-white/5 p-4 rounded-xl transition-all duration-300">
            <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur group-hover:bg-white/35 transition-colors duration-300 shadow-lg">
              <Globe className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">🌍 Global Delivery</h3>
              <p className="text-sky-50 text-sm leading-relaxed">Ships to over 100+ countries worldwide</p>
            </div>
          </div>
        </div>


      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand (visible on small screens) */}
          <div className="lg:hidden mb-8 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-sky-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🛍️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">storeMX</h2>
            </div>
            <p className="text-gray-600 text-sm font-medium">Your Premier Online Shopping Destination</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 via-sky-600 to-sky-700 px-8 pt-8 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="text-xl">🛍️</span>
                </div>
                <h1 className="text-3xl font-bold text-white">storeMX</h1>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-sky-50 text-sm">Sign in to your account and continue your premium shopping experience</p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) {
                          setErrors({ ...errors, email: "" });
                        }
                      }}
                      required
                      placeholder="you@example.com"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? "border-red-500 focus:ring-red-500 focus:border-transparent"
                          : "border-gray-300 focus:ring-sky-500 focus:border-transparent"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>❌</span> {errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <Link
                      to="/register"
                      className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors"
                    >
                      Need an account?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors({ ...errors, password: "" });
                        }
                      }}
                      required
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 border rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 transition-all ${
                        errors.password
                          ? "border-red-500 focus:ring-red-500 focus:border-transparent"
                          : "border-gray-300 focus:ring-sky-500 focus:border-transparent"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <span>❌</span> {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-sky-600 bg-white border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-sky-500"
                  />
                  <label htmlFor="remember" className="ml-2.5 text-sm text-gray-600 cursor-pointer">
                    Remember me for 30 days
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
                >
                  <LogIn className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Guest Checkout */}
              <Link
                to="/products"
                className="w-full block text-center py-3 px-4 border-2 border-gray-300 hover:border-sky-600 text-gray-700 hover:text-sky-600 font-semibold rounded-lg transition-all duration-200"
              >
                Continue as Guest
              </Link>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <p className="text-sm text-center text-gray-600">
                New to storeMX?{" "}
                <Link 
                  to="/register" 
                  className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5 flex gap-3 hover:shadow-md transition-all duration-300">
            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-green-900 font-semibold mb-1">
                🔐 <strong>Secure Login</strong>
              </p>
              <p className="text-xs text-green-800">
                Your password is encrypted with industry-standard security protocols. storeMX protects your account with SSL encryption and never stores passwords in plain text.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
