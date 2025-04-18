import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

const categories = ["食費", "衣服", "趣味・娯楽", "日用品", "その他"];

export default function ExpenseForm({ onSave, initialData, onClearEdit }) {
  const [category, setCategory] = useState(categories[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setCategory(initialData.category);
      setAmount(initialData.amount);
      setNote(initialData.note);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !date) return alert("金額と日付は必須です");

    try {
      if (initialData) {
        // 編集処理
        await updateDoc(doc(db, "expenses", initialData.id), {
          date: Timestamp.fromDate(new Date(date)),
          category,
          amount: Number(amount),
          note,
        });
        alert("更新しました！");
        if (onClearEdit) onClearEdit(); // 編集モード終了
      } else {
        // 新規登録処理
        await addDoc(collection(db, "expenses"), {
          date: Timestamp.fromDate(new Date(date)),
          category,
          amount: Number(amount),
          note,
          createdAt: Timestamp.now(),
        });
        alert("保存しました！");
      }

      setAmount("");
      setNote("");
      setDate("");
      setCategory(categories[0]);
      if (onSave) onSave();

    } catch (e) {
      console.error("保存失敗:", e);
      alert("エラーが発生しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="金額"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="no-spinner"
      />

      <input
        type="text"
        placeholder="内容（任意）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {initialData ? "更新" : "保存"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onClearEdit}
            className="bg-gray-400 text-white p-2 rounded"
          >
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}
