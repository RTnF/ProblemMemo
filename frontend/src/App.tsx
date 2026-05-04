import { useEffect, useState } from "react";
import "./App.css";

type Problem = {
  "problem-id"?: string;
  title: string;
  url?: string;
  submission_url?: string;
  tags?: string[];
  memo?: string;
};

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
  const [problem, setProblem] = useState<Problem>({ title: "Loading..." });

  useEffect(() => {
    fetch(`${API_URL}/api/problems/ac-abc001-a`)
      .then((res) => res.text())
      .then((data) => setProblem(JSON.parse(data)))
      .catch(() => setProblem({ title: "Error!" }));
  }, []);
  return (
    <>
      <section id="center">
        <div>
          <p>AtCoder / ABC / ABC001 / A</p>
          <h1>{problem.title}</h1>
          <p>{problem.tags}</p>
          <p>
            <a href={problem.url}>問題</a>
            {" / "}
            <a href={problem.submission_url}>提出</a>
          </p>
          <p>{problem.memo}</p>
        </div>
      </section>
    </>
  );
}

export default App;
