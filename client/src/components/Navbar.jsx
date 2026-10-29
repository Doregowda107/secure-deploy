import { NavLink } from "react-router-dom";
import logo from "../assets/mongodb.svg";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6"
      >
        <NavLink to="/" className="flex items-center gap-3" aria-label="Home">
          <img alt="MongoDB logo" className="h-8 w-auto" src={logo} />
          <span className="hidden text-sm font-semibold tracking-tight text-slate-700 sm:inline">
            Employee Directory
          </span>
        </NavLink>

        <NavLink className="btn btn-primary" to="/create">
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />
          </svg>
          Create Employee
        </NavLink>
      </nav>
    </header>
  );
}
