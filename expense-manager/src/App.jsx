import React, { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import { db } from "./firebase";
import dayjs from "dayjs";
import ExpenseChart from "./ExpenseChart";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

function App() {
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("この支出を削除しますか？")) return;
    try {
      await deleteDoc(doc(db, "expenses", id));
      fetchExpenses();
    } catch (e) {
      console.error("削除失敗:", e);
      alert("削除に失敗しました");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingExpense) return;

    const { id, date, category, amount, note } = editingExpense;
    if (!amount || !date) {
      alert("金額と日付は必須です");
      return;
    }

    try {
      await updateDoc(doc(db, "expenses", id), {
        date: dayjs(date).toDate(),
        category,
        amount: Number(amount),
        note,
      });
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error("更新失敗:", error);
      alert("更新に失敗しました");
    }
  };

  const fetchExpenses = async () => {
    const snapshot = await getDocs(collection(db, "expenses"));
    const allData = snapshot.docs.map((doc) => {
      const data = doc.data();
      const dateObj = data.date?.toDate?.();
      const dateStr = dateObj ? dayjs(dateObj).format("YYYY-MM-DD") : "";
      return {
        id: doc.id,
        ...data,
        date: dateStr,
      };
    });

    const monthStr = currentMonth.format("YYYY-MM");
    const filtered = allData.filter((item) => item.date?.startsWith(monthStr));
    filtered.sort((a, b) => a.date.localeCompare(b.date));
    setExpenses(filtered);
  };

  useEffect(() => {
    fetchExpenses();
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, "month"));
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split("-");
    setCurrentMonth(dayjs(`${year}-${month}-01`));
  };

  const handleResetToToday = () => {
    setCurrentMonth(dayjs());
  };

  const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">支出管理</h1>

      <div className="max-w-md mx-auto">
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <ExpenseForm
            onSave={fetchExpenses}
            initialData={editingExpense}
            onClearEdit={() => setEditingExpense(null)}
          />
        </div>

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <div className="flex items-center justify-between mb-4 text-sm gap-2 flex-wrap">
            <button
              onClick={handlePrevMonth}
              className="px-3 py-0.5 text-sm bg-blue-200 rounded hover:bg-blue-300"
            >
              ← 前月
            </button>
            <input
              type="month"
              value={currentMonth.format("YYYY-MM")}
              onChange={handleMonthChange}
              className="text-sm font-semibold border rounded px-2 py-1"
            />
            <button
              onClick={handleNextMonth}
              className="px-3 py-0.5 text-sm bg-blue-200 rounded hover:bg-blue-300"
            >
              翌月 →
            </button>
            <button
              onClick={handleResetToToday}
              className="px-3 py-0.5 text-sm bg-gray-300 rounded hover:bg-gray-400"
            >
              今月に戻る
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mb-4">
            合計支出: <span className="text-lg font-bold text-red-500">¥{totalAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-center">
            <ExpenseChart expenses={expenses} totalAmount={totalAmount} />
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">支出一覧</h2>
          <div className="flex justify-center overflow-x-auto">
            <div className="w-full max-w-xl">
              <table className="w-full bg-white rounded-2xl shadow text-sm text-gray-700">
                <thead>
                  <tr className="bg-gray-100 text-left text-xs text-gray-600">
                    <th className="p-3 whitespace-nowrap">日付</th>
                    <th className="p-3 whitespace-nowrap">カテゴリ</th>
                    <th className="p-3 whitespace-nowrap">金額</th>
                    <th className="p-3">メモ</th>
                    <th className="p-3 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-xs whitespace-nowrap">{expense.date}</td>
                      <td className="p-3 text-xs whitespace-nowrap">{expense.category}</td>
                      <td className="p-3 text-xs whitespace-nowrap">¥{expense.amount}</td>
                      <td className="p-3 text-xs">{expense.note}</td>
                      <td className="p-3 flex gap-2 flex-wrap whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="bg-yellow-300 text-black px-2 py-0.5 text-xs rounded-md"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="bg-red-500 text-white px-2 py-0.5 text-xs rounded-md"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
