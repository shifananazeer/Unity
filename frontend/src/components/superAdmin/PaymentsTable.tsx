interface Props {
  payments: any[];
}

const PaymentsTable: React.FC<Props> = ({ payments }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">

      <table className="w-full">

        <thead className="bg-gray-100">
          <tr>
            {/* <th className="p-3 text-left">User</th> */}
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Month</th>
            <th className="p-3 text-left">Status</th>
       
          </tr>
        </thead>

        <tbody>

          {payments.map((payment) => (
            <tr key={payment._id} className="border-t">

              {/* <td className="p-3">
                {payment.user?.name}
              </td> */}

              <td className="p-3">
                ₹{payment.amount}
              </td>

              <td className="p-3">
                {payment.month}
              </td>

              <td className="p-3">

                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    payment.status === "paid"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  {payment.status}
                </span>

              </td>

             

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default PaymentsTable;