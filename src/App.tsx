
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

import { AuthProvider } from "@/context/AuthContext";
import { ElectionProvider } from "@/context/ElectionContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Elections from "@/pages/Elections";
import NotFound from "@/pages/NotFound";
import VerifyAadhaar from "@/pages/VerifyAadhaar";
import VerifyPassport from "@/pages/VerifyPassport";
import VerifyEmail from "@/pages/VerifyEmail";
import VerifyPhone from "@/pages/VerifyPhone";
import VerifyFace from "@/pages/VerifyFace";
import VerifyParty from "@/pages/VerifyParty";
import VerificationPending from "@/pages/VerificationPending";
import Dashboard from "@/pages/Dashboard";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

import "./App.css";

function App() {
  return (
    <>
      <SonnerToaster position="top-right" expand={true} richColors />
      <Toaster />
      <AuthProvider>
        <ElectionProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify/aadhaar" element={<VerifyAadhaar />} />
              <Route path="/verify/passport" element={<VerifyPassport />} />
              <Route path="/verify/email" element={<VerifyEmail />} />
              <Route path="/verify/phone" element={<VerifyPhone />} />
              <Route path="/verify/face" element={<VerifyFace />} />
              <Route path="/verify/party" element={<VerifyParty />} />
              <Route path="/verification-pending" element={<VerificationPending />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ElectionProvider>
      </AuthProvider>
    </>
  );
}

export default App;
