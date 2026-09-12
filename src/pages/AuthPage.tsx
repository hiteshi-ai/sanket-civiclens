import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (isRegistering) {
        await register({ email, password, full_name: fullName, phone: phone || undefined });
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FBFBF9] flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-[#E5E3DC] rounded-2xl shadow-md p-6 space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#2C5E48]">SANKET × CivicLens</p>
          <h1 className="text-2xl font-black text-[#191B1F] mt-2">{isRegistering ? "Create your citizen account" : "Sign in to CivicLens"}</h1>
          <p className="text-sm text-[#565C68] mt-1">Access is granted by your backend role.</p>
        </div>
        {isRegistering && <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm" />}
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm" />
        <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm" />
        {isRegistering && <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" className="w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm" />}
        {error && <div className="rounded-lg bg-[#FDF0ED] border border-[#F8D2CA] text-[#C54E38] px-3 py-2 text-sm">{error}</div>}
        <button disabled={submitting} className="w-full rounded-lg bg-[#2C5E48] hover:bg-[#1E4333] disabled:opacity-50 text-white font-bold py-2.5">{submitting ? "Please wait…" : isRegistering ? "Register" : "Login"}</button>
        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="w-full text-sm text-[#2C5E48] hover:underline">
          {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
        </button>
      </form>
    </main>
  );
}
