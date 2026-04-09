const SDMenuPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Student Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold">Menu</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            The menu page is wired into routing, but the detailed implementation is not present in
            the current branch snapshot.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-6 text-slate-700">
          This placeholder keeps the frontend build working until the full menu UI is restored.
        </div>
      </div>
    </main>
  );
};

export default SDMenuPage;
