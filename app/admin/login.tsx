'use client';
import { useState } from 'react';
export default function Login() {
 const [password, setPassword] = useState(''), [error, setError] = useState(''), [busy, setBusy] = useState(false);
 async function submit(e: React.FormEvent) {
  e.preventDefault(); setBusy(true); setError('');
  try { const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }); const d = await r.json() as { error?: string }; if (!r.ok) throw Error(d.error || 'Could not sign in.'); location.reload(); }
  catch (err) { setError((err as Error).message); setBusy(false); }
 }
 return <main className="access"><a href="/">Green & Blue</a><h1>Owner access</h1><p>Enter the owner password to manage reservations and availability.</p>
  <form className="request-form login-form" onSubmit={submit}>
   <label>Password<input type="password" name="password" autoComplete="current-password" autoFocus required value={password} onChange={e => setPassword(e.target.value)} /></label>
   {error && <p className="error" role="alert">{error}</p>}
   <button className="button" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
  </form></main>;
}
