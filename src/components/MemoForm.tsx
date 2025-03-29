import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";


const MemoForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoke("add_memo", { title, content });
      alert("Memo added successfully!");
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to add memo:", error);
      alert("Failed to add memo.");
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
    </form>
  );
};

export default MemoForm;
