import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, LockKeyhole, Mail, UserRound } from "lucide-react";
import { apiRequest } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [name,setName] = useState(""); const [email,setEmail] = useState(""); const [password,setPassword] = useState(""); const [busy,setBusy] = useState(false);
  const handleRegister = async (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !password) return toast.error("Please complete all fields.");
    setBusy(true);
    const {res,data} = await apiRequest("auth/register","POST",{name:name.trim(),email:email.trim(),password});
    setBusy(false);
    if (res.ok) { toast.success("Account created. Sign in to continue."); setTimeout(()=>navigate("/login"),700); }
    else toast.error(data.message || "Could not create your account.");
  };
  return <main className="auth-shell"><Toaster position="top-right"/><nav className="auth-nav"><Link to="/login" className="brand"><span className="brand-mark"><BriefcaseBusiness size={17}/></span>hirewise</Link><span className="nav-caption">A clearer path to your next role</span></nav>
    <section className="auth-layout register-layout"><div className="auth-story"><div className="eyebrow">A BETTER WAY TO KEEP TRACK</div><h1>Your next chapter<br/><span>starts here.</span></h1><p>Bring every application into focus. Track the details, notice your progress, and spend less time keeping things in your head.</p><div className="quote-card"><div className="quote-mark">“</div><p>Small steps, clearly tracked, add up to meaningful progress.</p><span>THE HIREWISE APPROACH</span></div></div>
      <div className="auth-card"><div className="card-kicker">GET STARTED</div><h2>Create your account</h2><p className="auth-subtitle">It only takes a moment to get organized.</p><form onSubmit={handleRegister} className="auth-form">
        <label>Your name</label><div className="input-wrap"><UserRound size={17}/><input placeholder="Alex Morgan" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} required/></div>
        <label>Email address</label><div className="input-wrap"><Mail size={17}/><input type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
        <label>Password</label><div className="input-wrap"><LockKeyhole size={17}/><input type="password" placeholder="Create a password" autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/></div>
        <button className="primary-button auth-submit" disabled={busy}>{busy?"Creating account…":"Create account"}<ArrowRight size={17}/></button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p><div className="auth-footnote">By continuing, you’re taking a more intentional approach to your search.</div></div></section>
    <footer className="auth-footer"><span>© {new Date().getFullYear()} HireWise</span><span>Thoughtful tools for your next chapter.</span></footer></main>;
}
