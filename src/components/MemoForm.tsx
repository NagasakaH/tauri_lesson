import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Memo } from "@ipc-if/memo";

const MemoForm = () => {
  const [title, setTitle] = useState("");
  const [result, setResult] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const message: Memo = await invoke("add_memo", { title, content });
      console.log(message);
      setResult(
        `メモを追加しました ${message.title},${message.content},${message.created_at.toString()}`
      );
      alert("Memo added successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to add memo:", error);
      setError(`Failed to add memo. ${error}`);
      alert(`Failed to add memo. ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
        ></textarea>
      </div>
      <button type="submit">Add Memo</button>
      <div>{result}</div>
      <div>{error}</div>
    </form>
  );
};

export default MemoForm;
