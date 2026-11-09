// src/pages/TxPage.jsx
import { useParams, Link } from "react-router-dom";
import { api } from "../api";
import { useApi } from "../hooks/useApi";

export default function TxPage() {
  const { hash } = useParams();
  const { data: tx, error } = useApi(() => api.transaction(hash), [hash]);
  if (error) return <p className="text-red-400">{error}</p>;
  if (!tx) return <p className="text-slate-400">Loading…</p>;
  return (
    <div className="space-y-2 text-sm">
      <h1 className="text-2xl font-semibold">Transaction</h1>
      <p className="break-all font-mono">{tx.hash}</p>
      <p>Status: {tx.status} · Block <Link className="text-sky-400" to={`/block/${tx.block_height}`}>#{tx.block_height}</Link></p>
      <p>From: <Link className="font-mono text-sky-400" to={`/address/${tx.from}`}>{tx.from}</Link></p>
      <p>To: <Link className="font-mono text-sky-400" to={`/address/${tx.to}`}>{tx.to}</Link></p>
      <p>Amount: {tx.amount} · Fee: {tx.fee}</p>
    </div>
  );
}