import PrivateRoute from "./components/PrivateRoute";
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Users from "./pages/Users.tsx";
import UserDetail from "./pages/UserDetail.tsx";
import UserForm from './pages/UserForm.tsx';
import Rooms from './pages/Rooms.tsx';
import RoomDetail from './pages/RoomDetail.tsx';
import RoomForm from './pages/RoomForm.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx'
import ReservationList from './pages/ReservationList.tsx'
import ReservationForm from './pages/ReservationForm.tsx'

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Publiczne */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Prywatne */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <UserDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <PrivateRoute>
              <UserForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <PrivateRoute>
              <Rooms />
            </PrivateRoute>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <PrivateRoute>
              <RoomDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/rooms/create"
          element={
            <PrivateRoute>
              <RoomForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <PrivateRoute>
              <ReservationList />
            </PrivateRoute>
          }
        />
        <Route
          path="/reservations/create"
          element={
            <PrivateRoute>
              <ReservationForm />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
