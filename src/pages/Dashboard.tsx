import { useState, useEffect } from "react";

import PensionerForm from "../components/PensionerForm";
import PensionerTable from "../components/PensionerTable";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [edit, setEdit] = useState<any>(null);
  const [reload, setReload] = useState(0);

  // Check localStorage on load
  const isLoggedIn = useState<boolean>(() => {
    const saved = localStorage.getItem("isLoggedIn");
    return saved === "true"; // convert string back to boolean
  });

  // Whenever isLoggedIn changes, update localStorage
  useEffect(() => {
    localStorage.setItem("isLoggedIn", String(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Navbar key={reload} />
      </div>
      <div className="grid md:grid-cols-2 gap-2">
        <div className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <PensionerForm
            editing={edit}
            onSaved={() => setReload((v) => v + 1)}
          />
        </div>
        <div className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <PensionerTable key={reload} onEdit={setEdit} />
        </div>
      </div>
    </div>
  );
}
// window.location.reload();
