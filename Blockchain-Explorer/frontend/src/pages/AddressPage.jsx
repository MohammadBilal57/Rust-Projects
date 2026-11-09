// src/pages/AddressPage.jsx
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useApi } from "../hooks/useApi";
import TxTable from "../components/TxTable";

export default function AddressPage() {
  const { address } = useParams();
  const { data, error } = useApi(() => api.address(address), [address]);
  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-slate-400">Loading…</p>;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Address</h1>
      <p className="break-all font-mono text-sm">{data.address}</p>
      <p>Balance: <b>{data.balance.toLocaleString()}</b> · {data.tx_count} transactions</p>
      <TxTable txs={data.transactions} />
    </div>
  );
}