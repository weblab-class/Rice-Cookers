import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { UserContext } from "../App";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const { userId, handleLogin, handleLogout } = useContext(UserContext);

  // hamburger dropdown state
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // search (UI only for now)
  const [search, setSearch] = useState("");

  // Close menu on outside click + Escape
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const onLogoutClick = () => {
    handleLogout();      // your App.jsx already POSTs /api/logout
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="NavBar">
      {/* Left: search + filter */}
      <div className="NavBar-left">
        <div className="NavBar-searchWrap">
          <span className="NavBar-searchIcon" aria-hidden="true">⌕</span>
          <input
            className="NavBar-searchInput"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="NavBar-iconButton"
            type="button"
            title="Filter"
            onClick={() => alert("Filter UI not wired yet")}
          >
            ⌁
          </button>
        </div>
      </div>

      {/* Right: create + hamburger */}
      <div className="NavBar-right" ref={menuRef}>
        <Link className="NavBar-iconButton NavBar-linkButton" to="/new" title="Create recipe">
          📷
        </Link>

        <button
          className="NavBar-iconButton"
          type="button"
          aria-label="Open menu"
          title="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
        </button>

        {menuOpen && (
          <div className="MiniMenu" role="menu" aria-label="User menu">
            {userId ? (
              <>
                <Link
                  className="MiniMenu-row MiniMenu-link"
                  to="/my"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  My Recipes
                </Link>

                <Link
                  className="MiniMenu-row MiniMenu-link"
                  to="/favorites"
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                >
                  Favorites
                </Link>

                <div className="MiniMenu-divider" />

                <button
                  className="MiniMenu-row MiniMenu-button"
                  type="button"
                  role="menuitem"
                  onClick={onLogoutClick}
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="MiniMenu-loginWrap">
                <div className="MiniMenu-row MiniMenu-muted">
                  You’re not logged in
                </div>
                <div className="MiniMenu-google">
                  <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => console.log("Login failed")}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
