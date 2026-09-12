import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Receipt, Search, ExternalLink, CheckCircle2, Clock, XCircle, Filter } from "lucide-react";
import { FinancialTransactionItem } from "../../../types/admin.types";

interface TransactionsTableProps {
  transactions: FinancialTransactionItem[];
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTransactions = transactions.filter((tx) => {
    const userName = tx.userId?.name || "";
    const userEmail = tx.userId?.email || "";
    const orderId = tx._id || "";

    const matchesSearch =
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || tx.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
            <XCircle className="w-3.5 h-3.5" /> Failed / Expired
          </span>
        );
    }
  };

  return (
    <div className="bg-[#111827]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-400" /> Recent Payment Transactions
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Audit log of subscription purchase checkouts</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user or transaction..."
              className="pl-9 pr-4 py-1.5 rounded-xl bg-gray-900 border border-gray-800 focus:border-blue-500 focus:outline-none text-white text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid Only</option>
            <option value="pending">Pending Only</option>
            <option value="failed">Failed / Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-900/90 text-gray-400 uppercase font-semibold border-b border-gray-800">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Plan</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No payment transactions matched your filter.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => {
                const userIdStr = tx.userId?._id || "";
                return (
                  <tr key={tx._id} className="hover:bg-gray-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-gray-300 font-semibold truncate max-w-[120px]">
                      {tx._id}
                    </td>
                    <td className="py-3.5 px-4">
                      {tx.userId ? (
                        <div>
                          <p className="font-bold text-white">{tx.userId.name}</p>
                          <p className="text-[11px] text-gray-400">{tx.userId.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500 font-italic">Guest / Deleted User</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 capitalize">
                      <span
                        className={`px-2 py-0.5 rounded font-bold ${
                          tx.plan === "premium"
                            ? "bg-purple-500/20 text-purple-300"
                            : tx.plan === "pro"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {tx.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-white">{formatVND(tx.price)}</td>
                    <td className="py-3.5 px-4">{getStatusBadge(tx.paymentStatus)}</td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {userIdStr && (
                        <Link
                          to={`/admin/users/${userIdStr}`}
                          className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white transition-all text-xs font-semibold"
                          title="Inspect User Details"
                        >
                          User <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionsTable;
