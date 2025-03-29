import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Memo } from "@ipc-if/memo";

const MemoForm = ({ setShowForm }: { setShowForm: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const message: Memo = await invoke("add_memo", { title, content });
      console.log(message);
      alert("Memo added successfully!");
    } catch (error) {
      console.error("Failed to add memo:", error);
      setError(`Failed to add memo. ${error}`);
      alert(`Failed to add memo. ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={() => setShowForm(false)}>閉じる</button>
      <button type="submit">保存</button>
      <div>
        <label htmlFor="title">タイトル:</label>
        <br />
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "90%" }}
        />
      </div>
      <div>
        <label htmlFor="content">コンテンツ:</label>
        <br />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{
            width: "90%",
            height: `calc(100vh - 150px)`, // Adjust height to fit the window, subtracting space for other elements
            boxSizing: "border-box",
          }}
        ></textarea>
      </div>
    </form>
  );
};

export default MemoForm;

