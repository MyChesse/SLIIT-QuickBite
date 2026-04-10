import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { SDCanteenContext } from "../context/SDCanteenContext";
import toast from "react-hot-toast";
import api from "../services/api";

const SDInventoryTable = () => {
  const { selectedCanteenId } = useContext(SDCanteenContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchItems = async () => {
    if (!selectedCanteenId) return;

    setLoading(true);
    try {
      const res = await api.get("http://localhost:5001/api/inventory", {
        headers: { "x-canteen-id": selectedCanteenId },
      });
      setItems(res.data.data);
    } catch (error) {
      console.error("Failed to load inventory", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();

    const handleUpdate = () => fetchItems();
    window.addEventListener("inventoryUpdated", handleUpdate);
    return () => window.removeEventListener("inventoryUpdated", handleUpdate);
  }, [selectedCanteenId]);

  const updateStock = async (itemId, change) => {
    setUpdatingId(itemId);
    try {
      await api.put(
        `http://localhost:5001/api/inventory/${itemId}/stock`,
        { quantity: change },
        { headers: { "x-canteen-id": selectedCanteenId } },
      );
      toast.success("Stock updated");
      fetchItems();
    } catch (error) {
      toast.error("Failed to update stock");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleAvailability = async (item) => {
    setUpdatingId(item._id);
    try {
      await api.put(
        `http://localhost:5001/api/inventory/${item._id}/availability`,
        {},
        { headers: { "x-canteen-id": selectedCanteenId } },
      );
      toast.success(
        `${item.name} is now ${!item.isAvailable ? "Available" : "Unavailable"}`,
      );
      fetchItems();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteItem = async (item) => {
    if (!confirm(`Delete "${item.name}"?`)) return;

    setUpdatingId(item._id);
    try {
      await api.delete(`http://localhost:5001/api/inventory/${item._id}`, {
        headers: { "x-canteen-id": selectedCanteenId },
      });
      toast.success(`${item.name} deleted`);
      fetchItems();
    } catch (error) {
      toast.error("Failed to delete item");
    } finally {
      setUpdatingId(null);
    }
  };

  if (!selectedCanteenId) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center">
        <p className="text-gray-500">
          Please select a canteen to view inventory
        </p>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      {/* Compact Header */}
      <div className="px-5 py-3 border-b flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800">📋 Inventory</h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
          {items.length} items
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="px-5 py-3 text-left font-medium text-gray-600">
                Item
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">
                Category
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">
                Price
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">
                Stock
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">
                Status
              </th>
              <th className="px-5 py-3 text-center font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => {
              const isLowStock = item.currentStock < item.lowStockThreshold;
              const isUpdating = updatingId === item._id;

              return (
                <tr
                  key={item._id}
                  className={`hover:bg-gray-50 transition ${isLowStock ? "bg-red-50" : ""}`}
                >
                  <td className="px-5 py-3">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-3xl">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-gray-500">
                    Rs. {item.price}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateStock(item._id, -1)}
                        disabled={isUpdating || item.currentStock <= 0}
                        className="w-7 h-7 flex items-center justify-center rounded-xl bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-40 transition text-lg"
                      >
                        −
                      </button>
                      <span
                        className={`font-bold text-base w-10 text-center ${isLowStock ? "text-red-600" : "text-gray-900"}`}
                      >
                        {item.currentStock}
                      </span>
                      <button
                        onClick={() => updateStock(item._id, 1)}
                        disabled={isUpdating}
                        className="w-7 h-7 flex items-center justify-center rounded-xl bg-green-100 text-green-600 hover:bg-green-200 text-lg"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleAvailability(item)}
                      disabled={isUpdating}
                      className={`px-4 py-1 text-xs font-medium rounded-3xl transition ${
                        item.isAvailable
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => deleteItem(item)}
                      disabled={isUpdating}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-sm">
          No items found. Add from the form.
        </div>
      )}
    </div>
  );
};

export default SDInventoryTable;
