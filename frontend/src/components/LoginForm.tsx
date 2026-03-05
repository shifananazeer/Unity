import React from "react";

const LoginForm: React.FC = () => {
  return (
    <form className="space-y-4">
      {/* Email */}
      <div>
        <label className="text-sm text-gray-600">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full mt-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
        />
      </div>

      {/* Login Button */}
      <button
        type="submit"
        className="w-full bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;