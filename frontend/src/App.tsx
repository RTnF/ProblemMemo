import { useEffect, useState } from "react";
import "./App.css";

// 環境変数に応じてオリジンを決定する
const getApiDomain = () => {
  // AWS Lambda環境ではデフォルトで NODE_ENV が設定される
  // またはCDKから注入した特定の環境変数を参照する
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5174"; // Viteのデフォルトポート
  }
  return "https://lcidmgtxqbjbxjv4zroqyi4rs40tsbcb.lambda-url.ap-northeast-1.on.aws";
};

const API_URL = getApiDomain();

function App() {
  const [message, setMessage] = useState<string>("Loading...");

  useEffect(() => {
    fetch(`${API_URL}/api/hello`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage("Error: " + err.message));
  }, []);
  return (
    <>
      <section id="center">
        <div>
          <p>AtCoder / ABC / ABC001 / A</p>
          <h1>積雪深差</h1>
          <p>Simple</p>
          <p>
            <a href="https://atcoder.jp/contests/abc001/tasks/abc001_1">問題</a>
            {" / "}
            <a href="https://atcoder.jp/contests/abc001/submissions/75474831">
              提出
            </a>
          </p>
          <p>{message}</p>
        </div>
      </section>
    </>
  );
}

export default App;
