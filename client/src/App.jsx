import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Global.css";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/auth";
import Signup from "./components/Signup";
import Login from "./components/Login";
import PasswordReset from "./components/PasswordReset";
import ProtectedSignup from "./components/ProtectedSignup";
import Home from "./components/Home";
import Article from "./components/Article";
import { NewsContextProvider } from "./context/news";
import BuyCredits from "./components/BuyCredits";
import Success from "./components/Success";
import Cancel from "./components/Cancel";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <NewsContextProvider>
          <div className="bg-white">
            <Navbar />
          </div>
          <Routes>
            <Route
              path="/signup"
              element={
                <ProtectedSignup>
                  <Signup />
                </ProtectedSignup>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedSignup>
                  <Login />
                </ProtectedSignup>
              }
            />
            <Route path="/passwordreset" element={<PasswordReset />} />

            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/buyCredits" element={<BuyCredits />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Routes>
        </NewsContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
