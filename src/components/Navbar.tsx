import { useContext } from "react";
import { Link } from "react-router-dom";
import { Ctx } from "../auth/AuthContext";

const Navbar: React.FC = () => {
  const auth = useContext(Ctx);

  // const isLoggedIn = auth.isLoggedIn === true;
  // const userRole = auth.user;
  // const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div className="font-bold text-lg">Pensioner</div>
      <div className="flex gap-4">
        {/* Always show Home */}
        <Link to="/" className="hover:text-yellow-400">
          Home
        </Link>
        <Link to="/login" className="hover:text-green-400">
          Login
        </Link>
        <Link to="/logout" className="hover:text-red-400">
          Logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
