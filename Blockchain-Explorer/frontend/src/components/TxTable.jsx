import { Link } from "react-router-dom";
import { short } from "../utils";

export default function TxTable({ txs }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-left text-slate-400">
          <tr>
            <th className="p-3">Hash</th>
            <th className="p-3">From</th>
            <th className="p-3">To</th>
            <th className="p-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {txs.map((tx) => (
            <tr key={tx.hash} className="border-t border-slate-800 hover:bg-slate-900/60">
              <td className="p-3 font-mono">
                <Link className="text-sky-400 hover:underline" to={`/tx/${tx.hash}`}>{short(tx.hash)}</Link>
              </td>
              <td className="p-3 font-mono">
                <Link className="hover:underline" to={`/address/${tx.from}`}>{short(tx.from, 6, 4)}</Link>
              </td>
              <td className="p-3 font-mono">
                <Link className="hover:underline" to={`/address/${tx.to}`}>{short(tx.to, 6, 4)}</Link>
              </td>
              <td className="p-3 text-right">{tx.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}