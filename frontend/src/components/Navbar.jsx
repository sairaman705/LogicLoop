import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setSearch("");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-sky-400 flex-shrink-0">
          LogicLoop
        </Link>

        {/* Search bar — hidden on mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md"
        >
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tech news..."
              className="w-full bg-slate-800 text-white text-sm px-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-sky-500 placeholder-slate-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-400 transition-colors"
            >
              🔍
            </button>
          </div>
        </form>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/"
            className="text-slate-300 hover:text-sky-400 transition-colors text-sm"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/bookmarks"
                className="text-slate-300 hover:text-sky-400 transition-colors text-sm"
              >
                Bookmarks
              </Link>
              <span className="text-slate-400 text-sm">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-300 hover:text-sky-400 transition-colors text-sm"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-sky-600 hover:bg-sky-500 text-white px-4 py-1.5 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-slate-300 hover:text-white text-xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 pb-3 border-t border-slate-800 pt-3 space-y-3">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tech news..."
              className="flex-1 bg-slate-800 text-white text-sm px-4 py-2 rounded-l-xl border border-slate-700 focus:outline-none focus:border-sky-500 placeholder-slate-500"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-r-xl transition-colors text-sm"
            >
              Search
            </button>
          </form>

          {/* Mobile links */}
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="text-slate-300 hover:text-sky-400 py-2 text-sm"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/bookmarks"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-sky-400 py-2 text-sm"
                >
                  Bookmarks
                </Link>
                <span className="text-slate-400 text-sm py-1">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-sm bg-slate-700 text-white px-4 py-2 rounded-lg text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-300 hover:text-sky-400 py-2 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm bg-sky-600 text-white px-4 py-2 rounded-lg inline-block"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
