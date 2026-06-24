import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import api from "../lib/api";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    let res;

    if (mode === "login") {
      res = await api.post("/auth/login", {
        email,
        password,
      });
    } else {
      res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });
    }

    login({
      user: res.data.user,
      token: res.data.token,
    });

    navigate("/dashboard");
  } catch (err: any) {
    alert(err.response?.data?.message || "Request failed");
  }
};

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.18 0.014 250), oklch(0.13 0.012 250))",
        }}
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{ background: "var(--gradient-primary)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full blur-3xl opacity-20"
          style={{ background: "var(--gradient-gold)" }}
        />

        <div className="relative flex items-center gap-2.5">
          <div
            className="grid h-11 w-11 place-items-center rounded-xl shadow-glow"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-xl font-bold gradient-text">Aurum POS</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Premium Suite
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-md"
        >
          <h2 className="text-4xl font-bold leading-tight">
            The premium <span className="gold-text">point-of-sale</span> for
            modern retail.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sell faster, manage inventory beautifully, and delight every
            customer with an experience built for the world's best storefronts.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: TrendingUp, t: "Real-time analytics & insights" },
              { icon: ShieldCheck, t: "Bank-grade security and audits" },
              { icon: Zap, t: "Lightning-fast checkout in seconds" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 border border-primary/20">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm">{f.t}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative text-xs text-muted-foreground">
          Trusted by 2,400+ stores worldwide · © Aurum 2026
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 flex items-center gap-2.5">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="text-lg font-bold gradient-text">Aurum POS</div>
          </div>

          <h1 className="text-3xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Sign in to your dashboard to continue."
              : "Start selling in minutes — no credit card required."}
          </p>

          <div className="mt-8 inline-flex p-1 rounded-xl bg-secondary/60 border border-border">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${mode === m ? "text-primary-foreground" : "text-muted-foreground"}`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--gradient-primary)" }}
                  />
                )}
                <span className="relative">
                  {m === "login" ? "Sign in" : "Sign up"}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <Field
                label="Full name"
                icon={<Sparkles className="h-4 w-4" />}
                placeholder="Aria Patel"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Field
              label="Email address"
              icon={<Mail />}
              placeholder="you@store.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Field
              label="Password"
              icon={<Lock />}
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    className="rounded border-border bg-input"
                  />{" "}
                  Remember me
                </label>
                <a className="text-primary hover:underline cursor-pointer">
                  Forgot password?
                </a>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-primary-foreground shadow-glow"
              style={{ background: "var(--gradient-primary)" }}
            >
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>

          <div className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link to="/login" className="text-foreground hover:underline">
              Terms
            </Link>{" "}
            &{" "}
            <Link to="/login" className="text-foreground hover:underline">
              Privacy
            </Link>
            .
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  ...rest
}: {
  label: string;
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </span>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          {...rest}
          className="w-full rounded-xl border border-border bg-input/40 backdrop-blur px-10 py-3 text-sm placeholder:text-muted-foreground/60 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition"
        />
      </div>
    </label>
  );
}

export default LoginPage;
