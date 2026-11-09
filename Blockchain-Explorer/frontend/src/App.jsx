import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import BlockPage from "./pages/BlockPage";
import TxPage from "./pages/TxPage";
import AddressPage from "./pages/AddressPage";

function SearchBar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    if (/^\d+$/.test(v)) navigate(`/block/${v}`);      // height
    else if (v.startsWith("0x")) navigate(`/address/${v}`);
    else navigate(`/tx/${v}`);                         // 64-char hash
    setQ("");
  };
  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search block height, address (0x…) or tx hash"
        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500"
      />
    </form>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200">
        <header className="border-b border-slate-800">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 p-4">
            <Link to="/" className="text-lg font-bold text-sky-400">MiniScan</Link>
            <SearchBar />
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/block/:id" element={<BlockPage />} />
            <Route path="/tx/:hash" element={<TxPage />} />
            <Route path="/address/:address" element={<AddressPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}