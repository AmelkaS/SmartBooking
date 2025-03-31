import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./pages/Users.tsx";
import UserDetail from "./pages/UserDetail.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />  
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </Router>
  );
}
