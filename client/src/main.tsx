import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import "./styles.css";

import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/mobile-nav";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import POS from "@/pages/POS";
import Products from "@/pages/Products";
import Categories from "@/pages/Categories";
import Customers from "@/pages/Customers";
import Sales from "@/pages/Sales";
import Transactions from "./pages/Transactions";
const qc = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 min-w-0">{children}</main>
      <MobileNav />
    </div>
  );
}

const shell = (el: React.ReactNode) => <AppLayout>{el}</AppLayout>;

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={qc}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* PUBLIC ROUTE */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={shell(
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>,
              )}
            />

            <Route
              path="/pos"
              element={shell(
                <ProtectedRoute>
                  <POS />
                </ProtectedRoute>,
              )}
            />

            <Route
              path="/products"
              element={shell(
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>,
              )}
            />

            <Route
              path="/categories"
              element={shell(
                <ProtectedRoute>
                  <Categories />
                </ProtectedRoute>,
              )}
            />

            <Route
              path="/customers"
              element={shell(
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>,
              )}
            />
            <Route
              path="/transactions"
              element={shell(
                <ProtectedRoute>
                  <Transactions />
                </ProtectedRoute>,
              )}
            />
            <Route
              path="/sales"
              element={shell(
                <ProtectedRoute>
                  <Sales />
                </ProtectedRoute>,
              )}
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>,
);
