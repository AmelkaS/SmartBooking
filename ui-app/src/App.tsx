import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./pages/Users.tsx";
import UserDetail from "./pages/UserDetail.tsx";
import UserForm from './pages/UserForm.tsx';
import Rooms from './pages/Rooms.tsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />  
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/users/create" element={<UserForm />} />
        <Route path="/rooms" element={<Rooms />} />
        </Routes>
    </Router>
  );
}
