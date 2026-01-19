import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Login from "./pages/Login";
import AddMovie from "./pages/admin/AddMovie";
import ManageMovies from "./pages/admin/ManageMovies";
import AdminRoute from "./auth/AdminRoute";
import Navbar from "./components/Navbar";
import Signup from "./pages/SignUp";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/admin/add"
          element={
            <AdminRoute>
              <AddMovie />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/manage"
          element={
            <AdminRoute>
              <ManageMovies />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}
