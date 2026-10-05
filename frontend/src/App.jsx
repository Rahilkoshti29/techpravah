import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ArticleDetail from "./pages/ArticleDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css'
function App() {
  // Hardcoded for now — change to "author" or "admin" manually to test Navbar UI
  // Later this comes from Context API / login state
  const currentRole = null; // try: "user", "author", "admin", or null

  return (
    <BrowserRouter>
      <Navbar role={currentRole} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;