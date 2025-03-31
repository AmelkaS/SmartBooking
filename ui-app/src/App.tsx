import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Users from "./pages/Users.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/users" element={<Users />} />  
      </Routes>
    </Router>
  );
}
