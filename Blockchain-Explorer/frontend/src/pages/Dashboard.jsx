import { Link } from "react-router-dom";
import { api } from "../api";
import { useApi } from "../hooks/useApi";
import { short, timeAgo } from "../utils";
import TxTable from "../components/TxTable";

function StatCard({ label, value, mono }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${mono ? "font-mono text-lg" : ""}`}>{value ?? "—"}</p>
    </div>
  );
}

export default function Dashboard() {
  const stats = useApi(api.stats, [], 5000);
  const blocks = useApi(() => api.blocks(8), [], 5000);
  const txs = useApi(() => api.transactions(8), [], 5000);

  const err = stats.error ?? blocks.error ?? txs.error;
  if (err) return <p className="text-red-400">Can't reach the API: {err}</p>;

  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Block height" value={stats.data?.height} />
        <StatCard label="Transactions" value={stats.data?.total_transactions} />
        <StatCard label="Addresses" value={stats.data?.total_addresses} />
        <StatCard label="Latest block hash" value={stats.data && short(stats.data.latest_block_hash)} mono />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-lg font-semibold">Latest blocks</h2>
          <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800">
            {blocks.data?.map((b) => (
              <li key={b.hash} className="flex items-center justify-between p-3 text-sm">
                <Link className="font-mono text-sky-400 hover:underline" to={`/block/${b.height}`}>
                  #{b.height}
                </Link>
                <span className="text-slate-400">{b.transactions.length} txs</span>
                <span className="text-slate-500">{timeAgo(b.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Latest transactions</h2>
          {txs.data && <TxTable txs={txs.data} />}
        </div>
      </section>
    </div>
  );
}