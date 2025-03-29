import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Memo } from "@ipc-if/memo";

const MemoList: React.FC = () => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const fetchedMemos: Memo[] = await invoke("get_memos");
        const sortedMemos = fetchedMemos.sort((a, b) => Number(b.updated_at) - Number(a.updated_at));
        setMemos(sortedMemos);
      } catch (err) {
        setError("Failed to fetch memos.");
        console.error(err);
      }
    };

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
            <div className="memo-card" key={memo.id} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0", borderRadius: "5px", backgroundColor: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3>{memo.title}</h3>
                <p>
                  {memo.content.split("\n").slice(0, 5).map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  {memo.content.split("\n").length > 5 && <React.Fragment>....</React.Fragment>}
                </p>
              </div>
              <div style={{ marginTop: "10px", fontSize: "0.9em", color: "#555", textAlign: "right" }}>
                <small>
                  Created: {new Date(Number(memo.created_at) * 1000).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })} |
                  Updated: {new Date(Number(memo.updated_at) * 1000).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
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
