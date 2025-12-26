import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { RequireAuth } from "@/auth/RequireAuth";

import Login from "@/pages/Login";
import HomeRedirect from "@/pages/HomeRedirect";
import NotFound from "@/pages/NotFound";

/* Admin */
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminMatches from "@/pages/admin/AdminMatches";
import AdminLiveMatch from "@/pages/admin/AdminLiveMatch";

/* Customer */
import CustomerLayout from "@/pages/customer/CustomerLayout";
import CustomerMatches from "@/pages/customer/CustomerMatches";
import CustomerScoreboard from "@/pages/customer/CustomerScoreboard";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
    <Routes>
      {/* Root */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* ================= ADMIN ROUTES ================= */}
      <Route
        path="/admin"
        element={
          <RequireAuth allowedRoles={["admin"]}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        {/* ✅ FIX: index redirect */}
        <Route index element={<Navigate to="/admin/matches" replace />} />
        <Route path="matches" element={<AdminMatches />} />
        <Route path="matches/:matchId/live" element={<AdminLiveMatch />} />
      </Route>

      {/* ================= CUSTOMER ROUTES ================= */}
      <Route
        path="/customer"
        element={
          <RequireAuth allowedRoles={["customer"]}>
            <CustomerLayout />
          </RequireAuth>
        }
      >
        {/* ✅ FIX: index redirect */}
        <Route index element={<Navigate to="/customer/matches" replace />} />
        <Route path="matches" element={<CustomerMatches />} />
        <Route path="matches/:matchId" element={<CustomerScoreboard />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
