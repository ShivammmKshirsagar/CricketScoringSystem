import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/auth/AuthContext";
import { RequireAuth } from "@/auth/RequireAuth";

import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";


import AdminLayout from "@/pages/admin/AdminLayout";
import AdminMatches from "@/pages/admin/AdminMatches";
import AdminLiveMatch from "@/pages/admin/AdminLiveMatch";


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
              
              <Route path="/" element={<CustomerLayout />}>
                
                <Route index element={<CustomerMatches />} />
                <Route path="matches" element={<CustomerMatches />} />
                <Route path="match/:matchId" element={<CustomerScoreboard />} />
              </Route>

              
              <Route path="/login" element={<Login />} />

             
              <Route path="/customer" element={<Navigate to="/" replace />} />
              <Route path="/customer/matches" element={<Navigate to="/" replace />} />
              <Route path="/customer/matches/:matchId" element={<Navigate to="/match/:matchId" replace />} />

              
              <Route
                path="/admin"
                element={
                  <RequireAuth allowedRoles={["admin"]}>
                    <AdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<Navigate to="/admin/matches" replace />} />
                <Route path="matches" element={<AdminMatches />} />
                <Route path="matches/:matchId/live" element={<AdminLiveMatch />} />
              </Route>

              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}