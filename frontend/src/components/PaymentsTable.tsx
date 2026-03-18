import React, { useState } from "react";

interface Payment {
  _id: string;
  amount: number;
  month: string;
  status: string;
  screenshot?: string;
  userId: {
    fullName: string;
    mobileNumber: string;
    admin?: { fullName: string };
    coordinator?: { fullName: string; type: string };
  } | null; // userId can be null
}

interface Props {
  payments: Payment[];
  showAdminColumn?: boolean;
  showCoordinatorColumn?: boolean;
}

const PaymentsTable: React.FC<Props> = ({
  payments,
  showAdminColumn = true,
  showCoordinatorColumn = true,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/api$/, "");

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Phone</th>
              {showAdminColumn && <th className="p-3 text-left">Admin</th>}
              {showCoordinatorColumn && <th className="p-3 text-left">Coordinator</th>}
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Month</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Screenshot</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const user: NonNullable<Payment["userId"]> = payment.userId || {
                fullName: "-",
                mobileNumber: "-",
                admin: undefined,
                coordinator: undefined,
              };

              return (
                <tr key={payment._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{user.fullName}</td>
                  <td className="p-3">{user.mobileNumber}</td>
                  {showAdminColumn && <td className="p-3">{user.admin?.fullName || "-"}</td>}
                  {showCoordinatorColumn && (
                    <td className="p-3">
                      {user.coordinator
                        ? `${user.coordinator.fullName} - ${user.coordinator.type}`
                        : "-"}
                    </td>
                  )}
                  <td className="p-3">₹{payment.amount}</td>
                  <td className="p-3">{payment.month}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        payment.status === "paid" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-3">
                    {payment.screenshot ? (
                      <img
                        src={`${backendUrl}/${payment.screenshot}`}
                        alt="payment"
                        className="w-12 h-12 object-cover rounded cursor-pointer border"
                        onClick={() =>
                          setSelectedImage(`${backendUrl}/${payment.screenshot}`)
                        }
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {payments.map((payment) => {
          const user: NonNullable<Payment["userId"]> = payment.userId || {
            fullName: "-",
            mobileNumber: "-",
            admin: undefined,
            coordinator: undefined,
          };

          return (
            <div
              key={payment._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{user.fullName}</span>
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    payment.status === "paid" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {payment.status}
                </span>
              </div>

              <div className="flex flex-col space-y-1">
                <span>
                  <strong>Phone:</strong> {user.mobileNumber}
                </span>
                {showAdminColumn && (
                  <span>
                    <strong>Admin:</strong> {user.admin?.fullName || "-"}
                  </span>
                )}
                {showCoordinatorColumn && (
                  <span>
                    <strong>Coordinator:</strong>{" "}
                    {user.coordinator
                      ? `${user.coordinator.fullName} - ${user.coordinator.type}`
                      : "-"}
                  </span>
                )}
                <span>
                  <strong>Amount:</strong> ₹{payment.amount}
                </span>
                <span>
                  <strong>Month:</strong> {payment.month}
                </span>
              </div>

              <div>
                <strong>Screenshot:</strong>{" "}
                {payment.screenshot ? (
                  <img
                    src={`${backendUrl}/${payment.screenshot}`}
                    alt="payment"
                    className="w-20 h-20 object-cover rounded cursor-pointer border mt-1"
                    onClick={() =>
                      setSelectedImage(`${backendUrl}/${payment.screenshot}`)
                    }
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-full max-h-full">
            <button
              className="absolute -top-3 -right-3 bg-white rounded-full px-3 py-1 shadow"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Payment Screenshot"
              className="max-h-[80vh] max-w-[90vw] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsTable;