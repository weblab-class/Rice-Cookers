import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../utils/api";

const NavBar = () => {
	const { user, setUser } = useContext(AuthContext);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);
	const navigate = useNavigate();

	const toggleMenu = () => setMenuOpen((prev) => !prev);

	const handleLogout = async () => {
		try {
			await logout();
			setUser(null);
			navigate("/login");
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<nav className="NavBar">
			<div className="NavBar__left">
				<Link to="/" className="NavBar__brand">
					Recipe App
				</Link>
			</div>

			<div className="NavBar__right" ref={menuRef}>
				<button className="NavBar__menuButton" onClick={toggleMenu} aria-label="Menu">
					☰
				</button>

				<div className={`NavBar__menu ${menuOpen ? "NavBar__menu--open" : ""}`}>
					<Link to="/" className="NavBar__link" onClick={() => setMenuOpen(false)}>
						Home
					</Link>

					{user ? (
						<>
							<Link to="/create" className="NavBar__link" onClick={() => setMenuOpen(false)}>
								Create
							</Link>
							<button className="NavBar__link NavBar__logout" onClick={handleLogout}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="NavBar__link" onClick={() => setMenuOpen(false)}>
								Login
							</Link>
							<Link to="/register" className="NavBar__link" onClick={() => setMenuOpen(false)}>
								Register
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
