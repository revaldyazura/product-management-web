import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import '../../styles/components/navigation/UserMenu.css';

export default function UserMenu() {
  const { hasRole, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setMenuOpen((v) => !v)
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const onEsc = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [menuOpen]);

  const toAdminUsers = () => {
    closeMenu();
    navigate("/admin/users");
  };

  const toAdminProducts = () => {
    closeMenu();
    navigate("/admin/products");
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="user__menu" ref={menuRef}>
      <button
        className="user__menu-btn"
        aria-label="menu"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
      >
        <ArrowDropDownIcon />
      </button>

      {menuOpen && (
        <div className="user__dropdown" role="menu">
          {hasRole('admin') && (
            <>
              <button
                className="user__dropdown-item"
                role="menuitem"
                onClick={toAdminUsers}
              >
                Manage User
              </button>
              <button
                className="user__dropdown-item"
                role="menuitem"
                onClick={toAdminProducts}
              >
                Manage Product
              </button>
              <div className="user__dropdown-separator" aria-hidden="true" />
            </>
          )}
          <button
            className="user__dropdown-item"
            role="menuitem"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}