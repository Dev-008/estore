import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, ShieldCheck, Zap, Globe, CheckCircle2 } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) {
        toast.success("✅ Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("❌ Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = password.length >= 8 ? "strong" : password.length >= 6 ? "medium" : "weak";

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Side - Benefits & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-600 via-slate-700 to-gray-700 text-white px-8 py-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -ml-40 -mb-40"></div>

        {/* Logo & Brand */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <span className="text-2xl">📦</span>
            </div>
            <h2 className="text-3xl font-bold">StoreMX</h2>
          </div>
          <p className="text-sky-50 text-sm">Join millions of happy shoppers</p>
        </div>

        {/* Benefits */}
        <div className="relative z-10 space-y-6">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Quick Sign Up</h3>
              <p className="text-sky-50 text-sm">Create account in less than 30 seconds</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">100% Safe</h3>
              <p className="text-sky-50 text-sm">Your personal data is fully protected</p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Global Community</h3>
              <p className="text-sky-50 text-sm">Connect with shoppers across the world</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-2xl font-bold">2M+</p>
            <p className="text-xs text-sky-50">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">50K+</p>
            <p className="text-xs text-sky-50">Products</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">4.8⭐</p>
            <p className="text-xs text-sky-50">Rating</p>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:py-12">
        <div className="w-full max-w-md">
          {/* Mobile Brand (visible on small screens) */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-sky-700 rounded-lg flex items-center justify-center">
                <span className="text-xl">📦</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">StoreMX</h2>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 px-8 pt-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-sky-50 text-sm">Join StoreMX and start shopping today</p>
            </div>

            {/* Form */}
            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">We'll never share your email</p>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {/* Password Strength */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength === "strong"
                            ? "w-full bg-green-500"
                            : passwordStrength === "medium"
                            ? "w-2/3 bg-yellow-500"
                            : "w-1/3 bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength === "strong"
                        ? "text-green-600"
                        : passwordStrength === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}>
                      {passwordStrength === "strong" ? "Strong" : passwordStrength === "medium" ? "Medium" : "Weak"}
                    </span>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && password === confirmPassword && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-green-600 text-xs font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Passwords match
                    </div>
                  )}
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-sky-600 bg-white border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-sky-500 mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                    I agree to StoreMX{" "}
                    <a href="#" className="text-sky-600 hover:text-sky-700 font-medium">
                      terms and conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-sky-600 hover:text-sky-700 font-medium">
                      privacy policy
                    </a>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={loading || !agreeTerms}
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group mt-6"
                >
                  <UserPlus className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-sky-600 hover:text-sky-700 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800">
              <strong>Privacy First:</strong> Your data is encrypted with AES-256 encryption. We never sell or share your personal information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
