import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Article from "./pages/Article.jsx";
import Bookmarks from "./pages/Bookmarks";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function Layout() {
  const location = useLocation();
  const hideNavbar = ["/login", "/signup"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Only show Navbar on non-auth pages */}
      {!hideNavbar && <Navbar />}

      <main className={`max-w-7xl mx-auto px-4 py-8`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<Article />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
