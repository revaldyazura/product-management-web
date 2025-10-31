import React from 'react';
import Logo from '../branding/Logo';
import UserMenu from '../navigation/UserMenu';
import { useAuth } from '../../context/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../../styles/components/common/PageHeader.css';
import defaultAvatar from "../../assets/default-avatar.svg";
import { withBaseUrl } from '../../utils/helper';

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
        <div className='page__user'>
          <span className="page__username">{user?.name ?? 'User'}</span>
          {user?.avatar_url ? (
            <img
              src={withBaseUrl(user.avatar_url)}
              alt={user.name}
            style={{ width: 28, height: 28, borderRadius: '50%' }}
            />
          ) : (
            <img src={defaultAvatar} alt='Foto Profil' 
            style={{ width: 28, height: 28, borderRadius: '50%' }}
            />
          )}
          {/* </div> */}
        </div>
      </div>
    </header>
  );
}
