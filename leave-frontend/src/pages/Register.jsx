import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/api/auth.api";
import { successAlert, errorAlert } from "@/utils/swal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Mail, Lock, User, Briefcase } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!form.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      successAlert("Registration successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      errorAlert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Leave<span className="text-blue-600">MS</span>
            </h1>
            <p className="text-slate-500">Create your account to get started</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className="pl-10 border-slate-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="pl-10 border-slate-300 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 text-slate-400 w-5 h-5 pointer-events-none z-10" />
                <Select
                  value={form.role}
                  onValueChange={(value) => handleFieldChange("role", value)}
                >
                  <SelectTrigger className="pl-10 border-slate-300 focus:border-green-500">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EMPLOYEE">Employee</SelectItem>
                    <SelectItem value="HR">HR Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value)
                  }
                  className="pl-10 pr-10 border-slate-300 focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Min 6 chars, with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleFieldChange("confirmPassword", e.target.value)
                  }
                  className="pl-10 pr-10 border-slate-300 focus:border-green-500 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/login")}
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
          >
            Login Here
          </Button>

          {/* Test Credentials Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-blue-800">
              <strong>HR:</strong> hr@demo.com / Pass123
            </p>
            <p className="text-xs text-blue-800">
              <strong>Employee:</strong> emp@demo.com / Pass123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
