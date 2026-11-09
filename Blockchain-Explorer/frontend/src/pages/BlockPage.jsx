// src/pages/BlockPage.jsx
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useApi } from "../hooks/useApi";
import TxTable from "../components/TxTable";

export default function BlockPage() {
  const { id } = useParams();
  const { data: block, error } = useApi(() => api.block(id), [id]);
  if (error) return <p className="text-red-400">{error}</p>;
  if (!block) return <p className="text-slate-400">Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Block #{block.height}</h1>
      <dl className="grid gap-2 text-sm">
        <div><dt className="text-slate-400">Hash</dt><dd className="break-all font-mono">{block.hash}</dd></div>
        <div><dt className="text-slate-400">Previous hash</dt><dd className="break-all font-mono">{block.prev_hash}</dd></div>
        <div><dt className="text-slate-400">Time</dt><dd>{new Date(block.timestamp * 1000).toLocaleString()}</dd></div>
      </dl>
      <TxTable txs={block.transactions} />
    </div>
  );
}