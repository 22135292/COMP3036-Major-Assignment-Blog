export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-screen w-full bg-[#f7f5f0] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative hidden overflow-hidden bg-[#111827] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-[#a31631]/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-[#f0b45c]/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#a31631] text-sm font-black shadow-xl">FS</span>
          <div><p className="font-bold">Full Stack Blog</p><p className="text-xs uppercase tracking-[0.2em] text-slate-400">Editorial platform</p></div>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#f0b45c]">Publish with confidence</p>
          <h1 className="text-6xl font-black leading-[1.02] tracking-[-0.055em]">Stories deserve a beautiful home.</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">Create, refine and publish thoughtful articles through one focused editorial workspace.</p>
        </div>
        <p className="relative text-xs text-slate-500">COMP3036 · Full Stack Development</p>
      </div>
      <div className="flex items-center justify-center px-6 py-12 md:px-14">{children}</div>
    </main>
  );
}
