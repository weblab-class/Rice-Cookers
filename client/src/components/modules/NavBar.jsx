import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { UserContext } from "../App";
import "./NavBar.css";

import submitIcon from "./assets/plus-icon.png";

const NavBar = () => {
	const navigate = useNavigate();
	const { userId, handleLogin, handleLogout } = useContext(UserContext);

	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef(null);

	const [search, setSearch] = useState("");

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
		handleLogout();
		setMenuOpen(false);
		navigate("/");
	};

	return (
		<nav className="NavBar">
			<div className="NavBar-left">
				<div className="NavBar-searchWrap">
					<span className="NavBar-searchIcon" aria-hidden="true">
						⌕
					</span>

					<input
						// searchbar
						className="NavBar-searchInput"
						placeholder="Nothing to see here..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<button
					  // filter
						className="NavBar-iconButton"
						type="button"
						title="Filter"
						onClick={() => alert("Oops! You've encountered an unimplemented feature. Please reconsider.")}
					>
						~
					</button>
				</div>
			</div>

			<div className="NavBar-right" ref={menuRef}>

				<Link className="NavBar-iconButton NavBar-linkButton" to="/submit" title="New recipe">
					+
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
									className="MiniMenu-row MiniMenu-link" to="/"
									role="menuitem"
									onClick={() => setMenuOpen(false)}
								>
									Home
								</Link>

								<Link className="MiniMenu-row MiniMenu-link" to="/my" role="menuitem" onClick={() => setMenuOpen(false)}>
									My Recipes
								</Link>

								<div className="MiniMenu-divider" />

								<button className="MiniMenu-row MiniMenu-button" type="button" role="menuitem" onClick={onLogoutClick}>
									Log out
								</button>
							</>
						) : (
							<div className="MiniMenu-loginWrap">
								<div className="MiniMenu-row MiniMenu-muted">You’re not logged in</div>
								<div className="MiniMenu-google">
									<GoogleLogin onSuccess={handleLogin} onError={() => console.log("Login failed")} />
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
