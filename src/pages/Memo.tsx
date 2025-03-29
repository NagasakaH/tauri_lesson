import React, { useState } from "react";
import MemoList from "../components/MemoList";
import MemoForm from "../components/MemoForm";

const MemoPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "閉じる" : "新規作成"}
      </button>
      {showForm ? (
        <MemoForm />
      ) : (
        <>
          <MemoList />
        </>
      )}
    </div>
  );
};

export default MemoPage;
