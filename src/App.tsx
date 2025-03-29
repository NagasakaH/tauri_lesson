import "./App.css";
import MemoForm from "./components/MemoForm";
import MemoList from "./components/MemoList";

function App() {
  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
      <h1>メモアプリ</h1>
      <MemoForm />
      <MemoList />
    </main>
  );
}

export default App;
