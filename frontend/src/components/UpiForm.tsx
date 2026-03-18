import React, { useState } from "react";

interface Props {
  currentUpi?: string;
  onSave: (upiId: string) => Promise<void>;
}

const UpiForm: React.FC<Props> = ({ currentUpi = "", onSave }) => {

  const [upiId, setUpiId] = useState(currentUpi);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSave(upiId);
      alert("UPI ID updated successfully");
    } catch (error) {
      alert("Failed to update UPI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md">

      <h2 className="text-xl font-bold mb-4">UPI Management</h2>

      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="Enter UPI ID (example@okaxis)"
        className="w-full border p-3 rounded-lg mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        {loading ? "Saving..." : "Save UPI ID"}
      </button>

    </div>
  );
};

export default UpiForm;