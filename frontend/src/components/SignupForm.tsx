import React from "react";

const SignupForm: React.FC = () => {
  return (
    <form className="grid grid-cols-2 gap-3">

      <input
        type="text"
        placeholder="Full Name"
        className="col-span-2 border p-2 rounded-lg"
      />

      <input
        type="tel"
        placeholder="Mobile Number"
        className="border p-2 rounded-lg"
      />

      <input
        type="text"
        placeholder="PIN Code"
        className="border p-2 rounded-lg"
      />

      <input
        type="text"
        placeholder="District"
        className="border p-2 rounded-lg"
      />

      <input
        type="text"
        placeholder="State"
        className="border p-2 rounded-lg"
      />

      <input
        type="text"
        placeholder="Panchayath / Corporation"
        className="col-span-2 border p-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="border p-2 rounded-lg"
      />

      <button
        type="submit"
        className="col-span-2 bg-teal-700 text-white py-2 rounded-lg hover:bg-teal-800"
      >
        Sign Up
      </button>

    </form>
  );
};

export default SignupForm;