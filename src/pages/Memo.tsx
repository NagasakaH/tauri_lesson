import React, { useState } from "react";
import MemoList from "../components/MemoList";
import MemoForm from "../components/MemoForm";

const MemoPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      {showForm ? (
        <MemoForm setShowForm={setShowForm} />
      ) : (
        <>
          <button onClick={() => setShowForm(!showForm)}>新規作成</button>
          <MemoList />
        </>
      )}
    </div>
  );
};

export default MemoPage;
