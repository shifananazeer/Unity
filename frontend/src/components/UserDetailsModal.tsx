import React, { useEffect, useState } from "react";
import { getUserDetails } from "../services/coordinator/CoordinatorService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const UserDetailsModal: React.FC<Props> = ({ isOpen, onClose, userId }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!userId || !isOpen) return;

    const fetchDetails = async () => {
      try {
        const data = await getUserDetails(userId);
        setUser(data);
      } catch (err) {
        console.error("Error fetching details", err);
      }
    };

    fetchDetails();
  }, [userId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">

        <h2 className="text-xl font-bold mb-4">User Details</h2>

        {user ? (
          <>
            <p><b>Name:</b> {user.fullName}</p>
             <p><b>User Code:</b> {user.userCode}</p>
            <p><b>Mobile:</b> {user.mobileNumber}</p>
            <p><b>District:</b> {user.district}</p>
            <p><b>Type:</b> {user.type}</p>
            <p><b>Referral Code:</b> {user.referralCode}</p>

            <p className="mt-3 font-semibold">
              Total Referrals: {user.referredUsers?.length || 0}
            </p>

            <ul className="mt-2 list-disc ml-5">
              {user.referredUsers?.length > 0 ? (
                user.referredUsers.map((ref: any) => (
                  <li key={ref._id}>
                    {ref.fullName} ({ref.mobileNumber})
                  </li>
                ))
              ) : (
                <p className="text-gray-500">No referrals</p>
              )}
            </ul>
          </>
        ) : (
          <p>Loading...</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDetailsModal;