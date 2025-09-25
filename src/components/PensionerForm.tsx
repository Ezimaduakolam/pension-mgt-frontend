import React, { useEffect, useState } from "react";
import api from "../api/client";

const empty = {
  fullName: "",
  lgaOfOrigin: "",
  ministry: "",
  rankOnRetirement: "",
  gradeLevel: "",
  step: "",
  salaryType: "",
  dateOfBirth: "",
  dateOfFirstAppointment: "",
  lastSalary: "",
};

const PensionerForm: React.FC<{ onSaved: () => void; editing?: any }> = ({
  onSaved,
  editing,
}) => {
  const [form, setForm] = useState<any>(empty);
  const [computed, setComputed] = useState<any>({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (editing)
      setForm({
        ...editing,
        dateOfBirth: editing.dateOfBirth?.slice(0, 10),
        dateOfFirstAppointment: editing.dateOfFirstAppointment?.slice(0, 10),
      });
  }, [editing]);

  async function save() {
    try {
      const payload = { ...form, lastSalary: Number(form.lastSalary) };
      if (editing?._id) await api.put(`/pensioners/${editing._id}`, payload);
      else await api.post("/pensioners", payload);

      onSaved();
      setForm(empty);
      setComputed({});
    } catch (e: any) {
      setError(e?.response?.data?.message || "Save failed");
    }
  }
  async function onDelete() {
    try {
      if (!editing?._id) {
        setError("No pensioner selected for deletion");
        return;
      }

      // // Show confirmation dialog
      // const confirmed = window.confirm(
      //   `Are you sure you want to delete pensioner: ${editing.name}?`
      // );
      // if (!confirmed) return;

      // Proceed with delete
      await api.delete(`/pensioners/${editing._id}`);

      onSaved(); // refresh pensioner list
      setForm(empty); // reset form state
      setComputed({}); // reset computed fields
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to delete");
    }
  }

  // preview calculations via temp endpoint or inline (optional)
  useEffect(() => {
    const dob = form.dateOfBirth && new Date(form.dateOfBirth);
    const dfa =
      form.dateOfFirstAppointment && new Date(form.dateOfFirstAppointment);
    const lastSalary = Number(form.lastSalary);
    if (dob && dfa && lastSalary > 0) {
      // Lightweight mirror of backend logic for UX preview only
      const sixty = new Date(dob);
      sixty.setFullYear(sixty.getFullYear() + 60);
      const thirtyFive = new Date(dfa);
      thirtyFive.setFullYear(thirtyFive.getFullYear() + 35);
      const retirement = sixty < thirtyFive ? sixty : thirtyFive;
      const mode = sixty < thirtyFive ? "age" : "year";
      const yearsServed = Math.max(
        0,
        retirement.getFullYear() - dfa.getFullYear()
      );
      // simple band
      const bands = [
        { min: 0, max: 4, gm: 0, pp: 0 },
        { min: 5, max: 5, gm: 1.0, pp: 0 },
        { min: 6, max: 6, gm: 1.08, pp: 0 },
        { min: 7, max: 7, gm: 1.16, pp: 0 },
        { min: 8, max: 8, gm: 1.24, pp: 0 },
        { min: 9, max: 9, gm: 1.32, pp: 0 },
        { min: 10, max: 10, gm: 1.0, pp: 0.3 },
        { min: 11, max: 11, gm: 1.08, pp: 0.32 },
        { min: 12, max: 12, gm: 1.16, pp: 0.34 },
        { min: 13, max: 13, gm: 1.24, pp: 0.36 },
        { min: 14, max: 14, gm: 1.32, pp: 0.38 },
        { min: 15, max: 15, gm: 1.4, pp: 0.4 },
        { min: 16, max: 16, gm: 1.48, pp: 0.42 },
        { min: 17, max: 17, gm: 1.56, pp: 0.44 },
        { min: 18, max: 18, gm: 1.64, pp: 0.46 },
        { min: 19, max: 19, gm: 1.72, pp: 0.48 },
        { min: 20, max: 20, gm: 1.8, pp: 0.5 },
        { min: 21, max: 21, gm: 1.88, pp: 0.52 },
        { min: 22, max: 22, gm: 1.96, pp: 0.54 },
        { min: 23, max: 23, gm: 2.08, pp: 0.56 },
        { min: 24, max: 24, gm: 2.12, pp: 0.58 },
        { min: 25, max: 25, gm: 2.2, pp: 0.6 },
        { min: 26, max: 26, gm: 2.28, pp: 0.62 },
        { min: 27, max: 27, gm: 2.36, pp: 0.64 },
        { min: 28, max: 28, gm: 2.44, pp: 0.66 },
        { min: 29, max: 29, gm: 2.52, pp: 0.68 },
        { min: 30, max: 30, gm: 2.6, pp: 0.7 },
        { min: 31, max: 31, gm: 2.68, pp: 0.72 },
        { min: 32, max: 32, gm: 2.76, pp: 0.74 },
        { min: 33, max: 33, gm: 2.84, pp: 0.76 },
        { min: 34, max: 34, gm: 2.92, pp: 0.78 },
        { min: 35, max: 35, gm: 3.0, pp: 0.8 },
      ];
      const band =
        bands.find((b) => yearsServed >= b.min && yearsServed <= b.max) ||
        bands[0];
      const gratuity = lastSalary * band.gm;
      const pension = lastSalary * band.pp;
      setComputed({
        retirementDate: retirement.toISOString().slice(0, 10),
        retirementMode: mode,
        yearsServed,
        gratuity,
        pension,
      });
    } else setComputed({});
  }, [form]);

  return (
    <div className="space-y-3">
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries({
          fullName: "Full Name",
          lgaOfOrigin: "LGA of Origin",
          ministry: "Ministry/Establishment",
          rankOnRetirement: "Rank on Retirement",
          gradeLevel: "Grade Level",
          step: "Step",
          salaryType: "Salary Type",
          dateOfBirth: "Date of Birth",
          dateOfFirstAppointment: "Date of First Appointment",
          lastSalary: "Last Annual Salary",
        }).map(([k, label]) => (
          <label key={k} className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">{label}</span>
            <input
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              type={
                k.includes("date")
                  ? "date"
                  : k === "lastSalary"
                  ? "number"
                  : "text"
              }
              value={(form as any)[k] as any}
              onChange={(e) =>
                setForm((s: any) => ({ ...s, [k]: e.target.value }))
              }
            />
          </label>
        ))}
      </div>
      {computed.retirementDate && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg">
          <div>
            <div className="text-xs text-gray-500">Retirement Date</div>
            <div className="font-semibold">{computed.retirementDate}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Mode</div>
            <div className="font-semibold uppercase">
              {computed.retirementMode}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Years Served</div>
            <div className="font-semibold">{computed.yearsServed}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Gratuity (₦)</div>
            <div className="font-semibold">
              {computed.gratuity?.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Pension / yr (₦)</div>
            <div className="font-semibold">
              {computed.pension?.toLocaleString()}
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-2">
        <button
          className="bg-green-600 text-white w-18 p-2 border rounded hover:bg-green-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={save}
        >
          {editing ? "Update" : "Save"}
        </button>
        {editing ? (
          <button
            onClick={onDelete}
            className="bg-red-600 text-white w-18 p-2 border rounded hover:bg-red-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Delete
          </button>
        ) : (
          <button
            onClick={() => setForm(empty)}
            className="w-18 p-2 border rounded hover:bg-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};
export default PensionerForm;
