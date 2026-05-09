import { Suspense } from "react";
import type { Route } from "./+types/home";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://lcidmgtxqbjbxjv4zroqyi4rs40tsbcb.lambda-url.ap-northeast-1.on.aws"
    : "http://localhost:5174";

type Problem = {
  problem_id: string;
  title: string;
  tags: string[];
  url: string;
  submission_url: string;
  memo: string;
};

function Home2({ problemId }: { problemId: string }) {
  const { data } = useSuspenseQuery({
    queryKey: [problemId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/problems/${problemId}`);
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json() as Promise<Problem>;
    },
  });
  // {"problem_id":"ac-abc001-b"}
  return (
    <>
      <p>{data?.problem_id}</p>
      <h1 className="text-2xl">{data?.title}</h1>
      <span>
        <a className="underline" href={data?.url}>
          問題
        </a>
        <a className="underline" href={data?.submission_url}>
          提出
        </a>
      </span>
      <p>{data?.memo}</p>
    </>
  );
}

export default function Home({ params }: Route.ComponentProps) {
  return (
    <ErrorBoundary fallback={<div>error</div>}>
      <Suspense fallback={<div>loading...</div>}>
        <Home2 problemId={params.problem_id} />
      </Suspense>
    </ErrorBoundary>
  );
}
