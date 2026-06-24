import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";

type Order = {
  invoice: string;
  total: number;
  status: string;
  createdAt: string;
};

function Transactions() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, []);

  return (
    <PageShell title="Transaction History" subtitle="View all completed sales">
      <div className="glass rounded-3xl p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border">
              <th className="p-3">Invoice</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o.invoice} className="border-b border-border">
                <td className="p-3 font-medium">{o.invoice}</td>

                <td>${o.total.toFixed(2)}</td>

                <td>
                  <span className="text-green-500">{o.status}</span>
                </td>

                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

export default Transactions;
