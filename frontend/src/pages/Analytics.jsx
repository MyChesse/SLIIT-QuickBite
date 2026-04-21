import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import api from "../services/api";
import AdminSidebarLayout from "../components/AdminSidebarLayout";

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#64748b",
];

const PRIMARY_CANTEENS = ["Main Canteen", "Hostel Canteen", "Mini Canteen"];

const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const normalizeCanteenName = (canteenName) => {
  switch ((canteenName || "").trim()) {
    case "New canteen":
    case "New Canteen":
      return "Main Canteen";
    case "Basement canteen":
    case "Basement Canteen":
      return "Hostel Canteen";
    case "Anohana Canteen":
      return "Mini Canteen";
    default:
      return (canteenName || "Unknown Canteen").trim();
  }
};

const isKnownCanteen = (canteenName) => {
  const value = String(canteenName || "")
    .trim()
    .toLowerCase();
  return value && value !== "unknown" && value !== "unknown canteen";
};

const isMiniCanteen = (canteenName) =>
  String(canteenName || "")
    .trim()
    .toLowerCase() === "mini canteen";

const toPercent = (value, total) => {
  if (!total) return 0;
  return Number(((value / total) * 100).toFixed(1));
};

const toPieData = (entries) => {
  const total = entries.reduce(
    (sum, entry) => sum + Number(entry.value || 0),
    0,
  );
  return entries.map((entry) => ({
    ...entry,
    percentage: toPercent(entry.value, total),
  }));
};

const PieCard = ({ title, data }) => {
  const chartEntries = data.filter((entry) => Number(entry.value || 0) > 0);
  const total = chartEntries.reduce(
    (sum, entry) => sum + Number(entry.value || 0),
    0,
  );

  if (!total) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-bold text-slate-800">{title}</h3>
        <p className="mt-4 text-sm text-slate-500">No data available.</p>
      </div>
    );
  }

  let progress = 0;
  const segments = chartEntries
    .map((entry, index) => {
      const start = progress;
      const end = progress + entry.percentage;
      progress = end;
      return `${PIE_COLORS[index % PIE_COLORS.length]} ${start}% ${end}%`;
    })
    .join(", ");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[180px_1fr] xl:items-center">
        <div
          className="mx-auto h-40 w-40 rounded-full border border-slate-200"
          style={{ background: `conic-gradient(${segments})` }}
        />
        <div className="space-y-2">
          {data.map((entry, index) => (
            <div
              key={entry.label}
              className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                  }}
                />
                <span className="font-medium text-slate-700">
                  {entry.label}
                </span>
              </div>
              <span className="font-semibold text-slate-700">
                {entry.value} ({entry.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [usersRes, ordersRes, feedbackRes, complaintRes, inventoryRes] =
          await Promise.all([
            api.get("/admin/users?limit=500&page=1"),
            api.get("/orders"),
            api.get("/feedback"),
            api.get("/complaints"),
            api.get("/admin/inventory?limit=1000&page=1"),
          ]);

        setUsers(
          Array.isArray(usersRes.data?.users) ? usersRes.data.users : [],
        );
        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setFeedbacks(
          Array.isArray(feedbackRes.data?.data) ? feedbackRes.data.data : [],
        );
        setComplaints(
          Array.isArray(complaintRes.data?.data) ? complaintRes.data.data : [],
        );
        setInventoryItems(
          Array.isArray(inventoryRes.data?.items)
            ? inventoryRes.data.items
            : [],
        );
      } catch (error) {
        console.error("Failed to load analytics data:", error);
        toast.error(
          error?.response?.data?.message || "Failed to load analytics data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const analytics = useMemo(() => {
    const roleMap = new Map();
    users.forEach((user) => {
      const role = String(user.role || "Unknown").toLowerCase();
      const key = role.charAt(0).toUpperCase() + role.slice(1);
      roleMap.set(key, (roleMap.get(key) || 0) + 1);
    });

    const itemToCanteenMap = new Map();
    inventoryItems.forEach((item) => {
      const itemName = String(item?.name || "")
        .trim()
        .toLowerCase();
      if (!itemName) return;
      const canteenName = normalizeCanteenName(
        item?.canteenId?.name || item?.canteenName,
      );
      if (!isKnownCanteen(canteenName)) return;
      if (isMiniCanteen(canteenName)) return;
      if (!itemToCanteenMap.has(itemName)) {
        itemToCanteenMap.set(itemName, canteenName);
      }
    });

    const canteenStats = new Map();

    PRIMARY_CANTEENS.forEach((canteen) => {
      canteenStats.set(canteen, {
        totalItemsOrdered: 0,
        grossIncomeCompleted: 0,
        itemCounts: new Map(),
      });
    });

    const ensureCanteen = (name) => {
      if (!canteenStats.has(name)) {
        canteenStats.set(name, {
          totalItemsOrdered: 0,
          grossIncomeCompleted: 0,
          itemCounts: new Map(),
        });
      }
      return canteenStats.get(name);
    };

    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const itemName = String(item?.name || "").trim();
        const itemKey = itemName.toLowerCase();
        const itemQty = Number(item?.quantity || 0);
        const itemPrice = Number(item?.price || 0);

        const orderCanteenName = normalizeCanteenName(
          order?.canteenName || order?.canteen,
        );
        const mappedCanteenName = itemToCanteenMap.get(itemKey);
        const canteenName = isKnownCanteen(orderCanteenName)
          ? orderCanteenName
          : isKnownCanteen(mappedCanteenName)
            ? mappedCanteenName
            : null;

        if (!canteenName || isMiniCanteen(canteenName)) return;

        const canteen = ensureCanteen(canteenName);
        canteen.totalItemsOrdered += itemQty;
        canteen.itemCounts.set(
          itemName || "Unknown Item",
          (canteen.itemCounts.get(itemName || "Unknown Item") || 0) + itemQty,
        );

        if (order.status === "Completed") {
          canteen.grossIncomeCompleted += itemQty * itemPrice;
        }
      });
    });

    const canteenRows = Array.from(canteenStats.entries())
      .map(([canteen, values]) => {
        const topItemEntry = Array.from(values.itemCounts.entries()).sort(
          (a, b) => b[1] - a[1],
        )[0] || ["N/A", 0];
        return {
          canteen,
          totalItemsOrdered: values.totalItemsOrdered,
          grossIncomeCompleted: values.grossIncomeCompleted,
          topItem: topItemEntry[0],
          topItemQty: topItemEntry[1],
        };
      })
      .sort((a, b) => b.totalItemsOrdered - a.totalItemsOrdered);

    const complaintMap = new Map();
    complaints.forEach((complaint) => {
      const canteen = normalizeCanteenName(complaint.canteen);
      if (!isKnownCanteen(canteen)) return;
      if (isMiniCanteen(canteen)) return;
      complaintMap.set(canteen, (complaintMap.get(canteen) || 0) + 1);
    });

    const feedbackMap = new Map();
    feedbacks.forEach((feedback) => {
      const canteen = normalizeCanteenName(feedback.canteen);
      if (!isKnownCanteen(canteen)) return;
      if (isMiniCanteen(canteen)) return;
      const current = feedbackMap.get(canteen) || { count: 0, ratingSum: 0 };
      current.count += 1;
      current.ratingSum += Number(feedback.rating || 0);
      feedbackMap.set(canteen, current);
    });

    const feedbackRows = PRIMARY_CANTEENS.map((canteen) => {
      const stats = isMiniCanteen(canteen)
        ? { count: 0, ratingSum: 0 }
        : feedbackMap.get(canteen) || { count: 0, ratingSum: 0 };
      return {
        canteen,
        count: stats.count,
        avgRating: stats.count
          ? Number((stats.ratingSum / stats.count).toFixed(2))
          : 0,
      };
    }).sort((a, b) => b.count - a.count);

    const complaintRows = PRIMARY_CANTEENS.map((canteen) => ({
      canteen,
      count: isMiniCanteen(canteen) ? 0 : complaintMap.get(canteen) || 0,
    })).sort((a, b) => b.count - a.count);

    return {
      totalUsers: users.length,
      totalOrders: orders.length,
      totalComplaints: complaints.length,
      totalFeedbacks: feedbacks.length,
      roleData: toPieData(
        Array.from(roleMap.entries()).map(([label, value]) => ({
          label,
          value,
        })),
      ),
      itemsByCanteenData: toPieData(
        canteenRows.map((row) => ({
          label: row.canteen,
          value: row.totalItemsOrdered,
        })),
      ),
      incomeByCanteenData: toPieData(
        canteenRows.map((row) => ({
          label: row.canteen,
          value: Number(row.grossIncomeCompleted.toFixed(2)),
        })),
      ),
      complaintsByCanteenData: toPieData(
        complaintRows.map((row) => ({ label: row.canteen, value: row.count })),
      ),
      feedbackByCanteenData: toPieData(
        feedbackRows.map((row) => ({ label: row.canteen, value: row.count })),
      ),
      canteenRows,
      complaintRows,
      feedbackRows,
      topComplaintCanteen: complaintRows[0] || null,
      topFeedbackCanteen: feedbackRows[0] || null,
    };
  }, [users, orders, feedbacks, complaints, inventoryItems]);

  const generatePdfReport = () => {
    try {
      setExporting(true);

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(15, 79, 185);
      doc.rect(0, 0, pageWidth, 70, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("QuickBite Admin Analytics Report", 40, 42);

      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString("en-LK")}`, 40, 92);

      autoTable(doc, {
        startY: 108,
        head: [["Metric", "Value"]],
        body: [
          ["Total Users", String(analytics.totalUsers)],
          ["Total Orders", String(analytics.totalOrders)],
          ["Total Complaints", String(analytics.totalComplaints)],
          ["Total Feedback", String(analytics.totalFeedbacks)],
          [
            "Top Complaint Canteen",
            analytics.topComplaintCanteen
              ? `${analytics.topComplaintCanteen.canteen} (${analytics.topComplaintCanteen.count})`
              : "N/A",
          ],
          [
            "Top Feedback Canteen",
            analytics.topFeedbackCanteen
              ? `${analytics.topFeedbackCanteen.canteen} (${analytics.topFeedbackCanteen.count}, Avg ${analytics.topFeedbackCanteen.avgRating})`
              : "N/A",
          ],
        ],
        headStyles: { fillColor: [37, 99, 235] },
      });

      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 180) + 16,
        head: [["Role", "Users", "Percentage"]],
        body: analytics.roleData.map((row) => [
          row.label,
          String(row.value),
          `${row.percentage}%`,
        ]),
        headStyles: { fillColor: [22, 163, 74] },
      });

      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 260) + 16,
        head: [
          [
            "Canteen",
            "Items Ordered",
            "Completed Gross Income",
            "Top Ordered Item",
          ],
        ],
        body: analytics.canteenRows.map((row) => [
          row.canteen,
          String(row.totalItemsOrdered),
          formatMoney(row.grossIncomeCompleted),
          `${row.topItem} (${row.topItemQty})`,
        ]),
        headStyles: { fillColor: [14, 116, 144] },
      });

      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 340) + 16,
        head: [["Complaint Canteen", "Count", "Percentage"]],
        body: analytics.complaintsByCanteenData.map((row) => [
          row.label,
          String(row.value),
          `${row.percentage}%`,
        ]),
        headStyles: { fillColor: [220, 38, 38] },
      });

      autoTable(doc, {
        startY: (doc.lastAutoTable?.finalY || 420) + 16,
        head: [["Feedback Canteen", "Count", "Avg Rating", "Percentage"]],
        body: analytics.feedbackRows.map((row) => {
          const pctEntry = analytics.feedbackByCanteenData.find(
            (item) => item.label === row.canteen,
          );
          return [
            row.canteen,
            String(row.count),
            String(row.avgRating),
            `${pctEntry?.percentage || 0}%`,
          ];
        }),
        headStyles: { fillColor: [124, 58, 237] },
      });

      const pageCount = doc.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        doc.setPage(page);
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.text(
          "SLIIT QuickBite - Confidential Admin Report",
          40,
          pageHeight - 20,
        );
        doc.text(
          `Page ${page} of ${pageCount}`,
          pageWidth - 40,
          pageHeight - 20,
          { align: "right" },
        );
      }

      doc.save("quickbite-admin-analytics-report.pdf");
      toast.success("PDF report generated");
    } catch (error) {
      console.error("Failed to generate analytics report:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex items-center justify-center px-4">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm px-8 py-8 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4" />
          <p className="text-slate-700 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminSidebarLayout
      activePage="analytics"
      contentClassName="px-4 py-4 sm:px-6 lg:px-8"
    >
      <div className="min-h-screen bg-[#f5f7fb] text-slate-800">
        <div className="bg-white border border-slate-200 rounded-[24px] px-5 py-4 shadow-sm mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-[34px] font-bold text-blue-900 tracking-tight">
                Analytics Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                User role analytics, canteen order performance, complaints,
                feedback, and PDF reporting.
              </p>
            </div>
            <button
              onClick={generatePdfReport}
              disabled={exporting}
              className="h-10 px-4 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {exporting ? "Generating..." : "Generate PDF Report"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
              Total Users
            </p>
            <div className="mt-3 text-3xl font-bold text-blue-700">
              {analytics.totalUsers}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
              Total Orders
            </p>
            <div className="mt-3 text-3xl font-bold text-indigo-700">
              {analytics.totalOrders}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
              Total Complaints
            </p>
            <div className="mt-3 text-3xl font-bold text-red-700">
              {analytics.totalComplaints}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
              Total Feedback
            </p>
            <div className="mt-3 text-3xl font-bold text-emerald-700">
              {analytics.totalFeedbacks}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <PieCard title="Users by Role" data={analytics.roleData} />
          <PieCard
            title="Items Ordered by Canteen"
            data={analytics.itemsByCanteenData}
          />
          <PieCard
            title="Gross Income (Completed Orders) by Canteen"
            data={analytics.incomeByCanteenData}
          />
          <PieCard
            title="Complaints by Canteen"
            data={analytics.complaintsByCanteenData}
          />
          <PieCard
            title="Feedback by Canteen"
            data={analytics.feedbackByCanteenData}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Top Complaint Canteen
            </h2>
            {analytics.topComplaintCanteen ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4">
                <p className="text-sm text-red-700">Canteen</p>
                <p className="text-2xl font-black text-red-800">
                  {analytics.topComplaintCanteen.canteen}
                </p>
                <p className="mt-2 text-sm text-red-700">
                  Total complaints: {analytics.topComplaintCanteen.count}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No complaints data.</p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              Top Feedback Canteen
            </h2>
            {analytics.topFeedbackCanteen ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                <p className="text-sm text-emerald-700">Canteen</p>
                <p className="text-2xl font-black text-emerald-800">
                  {analytics.topFeedbackCanteen.canteen}
                </p>
                <p className="mt-2 text-sm text-emerald-700">
                  Feedback count: {analytics.topFeedbackCanteen.count} | Avg
                  rating: {analytics.topFeedbackCanteen.avgRating}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">No feedback data.</p>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Canteen Order Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#f4f7fd]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    Canteen
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    Items Ordered
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    Gross Income (Completed)
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-slate-500 font-semibold">
                    Most Ordered Item
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.canteenRows.map((row) => (
                  <tr key={row.canteen} className="border-t border-slate-200">
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">
                      {row.canteen}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {row.totalItemsOrdered}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatMoney(row.grossIncomeCompleted)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {row.topItem} ({row.topItemQty})
                    </td>
                  </tr>
                ))}
                {!analytics.canteenRows.length && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      No canteen order data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default Analytics;
