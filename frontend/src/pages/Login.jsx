import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const { login, userToken } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (userToken) navigate("/dashboard", { replace: true }); }, [userToken, navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) return toast.error("Enter your email and password.");
    setBusy(true);
    const { res, data } = await apiRequest("auth/login", "POST", { email: email.trim(), password });
    setBusy(false);
    if (res.ok && data.token) { login(data.token); navigate("/dashboard", { replace: true }); }
    else toast.error(data.message || "Unable to sign in. Please try again.");
  };

  return <main className="auth-shell">
    <Toaster position="top-right" />
    <nav className="auth-nav"><Link to="/login" className="brand"><span className="brand-mark"><BriefcaseBusiness size={17}/></span>hirewise</Link><span className="nav-caption">A clearer path to your next role</span></nav>
    <section className="auth-layout">
      <div className="auth-story">
        <div className="eyebrow"><Sparkles size={14}/> YOUR CAREER, IN FOCUS</div>
        <h1>Make your next<br/><span>move count.</span></h1>
        <p>One calm place to organize applications, keep momentum, and see how far you’ve come.</p>
        <div className="story-preview"><div className="preview-top"><span className="preview-dot"/><span>YOUR JOB SEARCH</span><span className="preview-live">LIVE OVERVIEW</span></div><div className="preview-number">12 <small>applications tracked</small></div><div className="preview-bars"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="preview-legend"><span><b/> Applied</span><span><b/> Interviews</span><span><b/> Offers</span></div></div>
      </div>
      <div className="auth-card"><div className="card-kicker">WELCOME BACK</div><h2>Sign in to HireWise</h2><p className="auth-subtitle">Pick up right where you left off.</p>
        <form onSubmit={handleLogin} className="auth-form">
          <label>Email address</label><div className="input-wrap"><Mail size={17}/><input type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <label>Password</label><div className="input-wrap"><LockKeyhole size={17}/><input type={showPassword?"text":"password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" className="input-action" onClick={()=>setShowPassword(v=>!v)} aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div>
          <button className="primary-button auth-submit" disabled={busy}>{busy?"Signing in…":"Sign in"}<ArrowRight size={17}/></button>
        </form>
        <p className="auth-switch">New to HireWise? <Link to="/register">Create an account</Link></p>
        <div className="auth-footnote">Your job search deserves a little more clarity.</div>
      </div>
    </section>
    <footer className="auth-footer"><span>© {new Date().getFullYear()} HireWise</span><span>Thoughtful tools for your next chapter.</span></footer>
  </main>;
}
