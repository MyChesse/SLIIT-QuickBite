const SDInventoryPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Staff Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold">Inventory</h1>
          <p className="mt-3 max-w-2xl text-slate-600">
            The inventory module is available in this branch, but the full page implementation is not
            part of the current workspace yet.
          </p>
        </div>

        <div className="rounded-2xl bg-slate-100 p-6 text-slate-700">
          Use this screen to manage stock once the inventory API and UI are restored.
        </div>
      </div>
    </main>
  );
};

export default SDInventoryPage;
