import { LogOut,  User } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/slice/authSlice";
import TalkLoop from "../assets/TalkLoopLogo.png"

const Navbar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    // disconnectSocket();
  };

  return (
    <>
      <header className="fixed top-0 z-40 w-full bg-green-50/80 backdrop-blur-xl border-b border-green-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 ">
          <div className="flex items-center justify-between h-full">
            
            {/* left logo */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="flex items-center gap-2.5 hover:opacity-80 transition"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-green-200">
                      <img src={TalkLoop} alt="Logo" className='h-8 w-8'/>
                  
                </div>

                <h1 className="text-lg font-bold text-green-800">
                  TalkLoop
                </h1>
              </Link>
            </div>

            {/* right side */}
            <div className="flex items-center gap-3">
              {authUser && (
                <>
                  <Link
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-green-100 transition"
                    to={"/profile"}
                  >
                    <User className="h-5 w-4 text-green-600" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-green-100 transition"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-4 text-green-600" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;