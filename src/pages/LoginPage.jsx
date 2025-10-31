// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/form/InputField';
import '../styles/pages/LoginPage.css';
import { ReactComponent as BrandLogo } from '../assets/logo.svg';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import CheckboxForm from '../components/form/CheckboxForm';
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [remember, setRemember] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  if (user) return <Navigate to="/home" replace />;

  const emailError = !email ? 'Email wajib diisi' : '';
  const passwordError = !password ? 'Password wajib diisi' : '';
  const hasClientError = !!(emailError || passwordError);

  async function handleSubmit(e) {
    e.preventDefault();
    if (hasClientError) return;
    setSubmitting(true);
    setErrorMsg('');
    try {
      await login(email.trim(), password, remember ? 'local' : 'session');
      navigate('/home', { replace: true });
      toastSuccess('Welcome!');
    } catch (err) {
      const msg = err?.data?.detail || err?.message || 'Gagal masuk. Coba lagi.';
      toastError(msg || 'Gagal masuk. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand">
          <BrandLogo className="brand-logo" aria-label="Company logo" focusable="false" />
        </div>
        <p className="subtitle">Enter your email and password correctly</p>

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            id="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            error={emailError}
            autoComplete="email"
            fullWidth={true}
            variant="outlined"
            focusedOutlineColor='#FF7900'
            outlineColor='#FF7900'
            labelColor='#111827'
            focusedLabelColor='#111827'
          />
          <div className="field">
            <InputField
              id="password"
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              autoComplete="current-password"
              fullWidth={true}
              variant="outlined"
              focusedOutlineColor='#FF7900'
              outlineColor='#FF7900'
              labelColor='#111827'
              focusedLabelColor='#111827'
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPw((s) => !s)}
                      edge="end"
                    >
                      {showPw ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="field">
            <CheckboxForm label='Remember Me' colorChecked='#FF7900' checked={remember} onChange={(e, val) => setRemember(val)} />
          </div>


          {/* {errorMsg && <div role="alert" className="server-error">{errorMsg}</div>} */}

          <button className="primary" type="submit" disabled={submitting || hasClientError}>
            {submitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}