import React from 'react';
import Logo from '../branding/Logo';
import UserMenu from '../navigation/UserMenu';
import { useAuth } from '../../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../../styles/components/common/PageHeader.css';

/**
 * PageHeader (App-level top header bar used across pages)
 * Shows logo, user menu dropdown, user name and avatar
 */
export default function PageHeader() {
  const { user } = useAuth();
  return (
    <header className="page_header">
      <div className="page_header-left">
        <Logo />
      </div>
      <div className="page_header-right">
        <UserMenu />
        <span className="home__user">{user?.name ?? 'User'}</span>
        <span className="home__pic_profile">
          {user?.profile_pic ? (
            <img
              src={user.profile_pic}
              alt="Foto profil"
              style={{ width: 28, height: 28, borderRadius: '50%' }}
            />
          ) : (
            <AccountCircleIcon />
          )}
        </span>
      </div>
    </header>
  );
}
