/** @format */

import React, { useEffect, useState } from "react";
import api from "../api/client";

const PensionerTable: React.FC<{ onEdit: (row: any) => void }> = ({
  onEdit,
}) => {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    const { data } = await api.get("/pensioners", { params: { q } });
    setRows(data.items);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-3">
        <input
          className="input max-w-sm"
          placeholder="Search by name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className="bg-green-600 text-white w-18 p-2 border rounded hover:bg-green-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={load}
        >
          Refresh
        </button>
      </div>
      <div className="overflow-auto w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Name",
                "DOB",
                "First Appt",
                "Mode",
                "Retirement",
                "Yrs",
                "Last Salary",
                "Gratuity",
                "Pension",
                "",
              ].map((h) => (
                <th key={h} className="text-left p-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.fullName}</td>
                <td className="p-2">{r.dateOfBirth?.slice(0, 10)}</td>
                <td className="p-2">
                  {r.dateOfFirstAppointment?.slice(0, 10)}
                </td>
                <td className="p-2 uppercase">{r.retirementMode}</td>
                <td className="p-2">{r.retirementDate?.slice(0, 10)}</td>
                <td className="p-2">{r.yearsServed}</td>
                <td className="p-2">₦{r.lastSalary?.toLocaleString?.()}</td>
                <td className="p-2">₦{r.gratuity?.toLocaleString?.()}</td>
                <td className="p-2">₦{r.pension?.toLocaleString?.()}</td>
                <td className="p-2 text-right">
                  <button
                    className="bg-gray-800 text-white px-3 py-1 rounded-lg"
                    onClick={() => onEdit(r)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default PensionerTable;
