"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  password: password.trim(),
}),
      });
      if (!response.ok) {
        setError("Incorrect password. Please try again.");
        return;
      }
      router.replace("/");
      router.refresh();
    } catch {
      setError("Unable to sign in right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <span className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#151c24] text-[#f0b45c] shadow-xl"><LockKeyhole className="size-5" /></span>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a31631]">Content Studio</p>
        <h2 className="mt-2 text-4xl font-black tracking-[-0.04em] text-slate-950">Welcome back.</h2>
        <p className="mt-3 leading-7 text-slate-500">Enter the administrator password to manage articles, media and publishing.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="grid gap-2 text-sm font-bold text-slate-800">
          Password
          <input name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus className="h-13 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-normal outline-none transition focus:border-[#a31631] focus:bg-white focus:ring-4 focus:ring-[#a31631]/10" placeholder="Enter your password" />
        </label>
        {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#a31631] px-5 font-bold text-white shadow-xl shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-[#841229] disabled:opacity-50">
          {isSubmitting ? "Signing in…" : "Sign in"} <ArrowRight className="size-4" />
        </button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-400">Password-protected administrator access</p>
    </div>
  );
}
