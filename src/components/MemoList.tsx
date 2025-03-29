import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Memo } from "@ipc-if/memo";

const MemoList: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);
  const [editedMemo, setEditedMemo] = useState<{ title: string; content: string }>({ title: "", content: "" });
  const deleteMemo = async (id: number) => {
    try {
      await invoke("delete_memo", { id });
      fetchMemos();
    } catch (error) {
      console.error("Failed to delete memo:", error);
      setError(`Failed to delete memo. ${error}`);
      alert(`Failed to delete memo. ${error}`);
    }
  };
  const fetchMemos = async () => {
    try {
      const fetchedMemos: Memo[] = await invoke("get_memos");
      const sortedMemos = fetchedMemos.sort(
        (a, b) => Number(b.updated_at) - Number(a.updated_at)
      );
      setMemos(sortedMemos);
    } catch (err) {
      setError("Failed to fetch memos.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMemos();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {memos.length === 0 ? (
        <p>No memos available.</p>
      ) : (
        <div className="memo-list">
          {memos.map((memo) => (
            <div
              className="memo-card"
              key={memo.id}
              style={{
                position: "relative",
                border: "1px solid #ccc",
                padding: "10px",
                margin: "10px 0",
                borderRadius: "5px",
                backgroundColor: editingMemoId === memo.id ? "#f0f8ff" : "#ffffff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              onDoubleClick={() => {
                setEditingMemoId(memo.id);
                setEditedMemo({ title: memo.title, content: memo.content });
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  padding: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (window.confirm("削除してもよろしいですか？")) {
                    deleteMemo(memo.id);
                  }
                }}
              >
                削除
              </button>
              {editingMemoId === memo.id ? (
                <div>
                  <input
                    type="text"
                    value={editedMemo.title}
                    onChange={(e) =>
                      setEditedMemo((prev) => ({ ...prev, title: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      padding: "5px",
                      fontSize: "1em",
                    }}
                  />
                  <textarea
                    value={editedMemo.content}
                    onChange={(e) =>
                      setEditedMemo((prev) => ({ ...prev, content: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      height: "100px",
                      overflowY: "scroll",
                      padding: "5px",
                      fontSize: "1em",
                    }}
                  />
                  <button
                    onClick={() => {
                      const updatedMemos = memos.map((m) =>
                        m.id === memo.id ? { ...m, ...editedMemo } : m
                      );
                      setMemos(updatedMemos);
                      setEditingMemoId(null);
                    }}
                    style={{
                      marginTop: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div>
                  <h3>{memo.title}</h3>
                  <p
                    style={{
                      maxHeight: "100px",
                      overflowY: "scroll",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {memo.content}
                  </p>
                </div>
              )}
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "0.9em",
                  color: "#555",
                  textAlign: "right",
                }}
              >
                <small>
                  Created:{" "}
                  {new Date(Number(memo.created_at) * 1000).toLocaleString(
                    "ja-JP",
                    { timeZone: "Asia/Tokyo" }
                  )}{" "}
                  | Updated:{" "}
                  {new Date(Number(memo.updated_at) * 1000).toLocaleString(
                    "ja-JP",
                    { timeZone: "Asia/Tokyo" }
                  )}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoList;
