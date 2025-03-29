import "./App.css";
import MemoForm from "./components/MemoForm";
import MemoList from "./components/MemoList";
import MemoPage from "./pages/Memo";

function App() {
  return (
    <main className="container">
      <h1>メモアプリ</h1>
      <MemoPage />
    </main>
  );
}

export default App;
