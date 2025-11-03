// src/routes/AppRoutes.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import ManagementUsers from '../pages/admin/ManagementUsers';
import ManagementProducts from '../pages/admin/ManagementProducts';
import RequireRole from './RequireRole';
import ProductPage from '../pages/ProductPage';
import AllProductsPage from '../pages/AllProductsPage';

function PrivateRoute({ children }) {
  const { user, initializing } = useAuth();
  if (initializing) return null; // bisa spinner
  return user ? children : <Navigate to="/login" replace />;
}


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AllProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <ProductPage />
            </PrivateRoute>
          }
        />
        <Route element={<RequireRole role="admin" />}>
          <Route path="/admin/users" element={<ManagementUsers />} />
          <Route path="/admin/products" element={<ManagementProducts />} />
        </Route>
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}