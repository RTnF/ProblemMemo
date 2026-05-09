import type { Route } from "./+types/home";
import { useQuery } from "@tanstack/react-query";

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

export default function Home({ params }: Route.ComponentProps) {
  const { data } = useQuery({
    queryKey: [params.problem_id],
    queryFn: async () => {
      const response = await fetch(
        `${BASE_URL}/api/problems/${params.problem_id}`,
      );
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json() as Promise<Problem>;
    },
  });
  // {"problem_id":"ac-abc001-b"}
  return (
    <>
      <p>{data?.problem_id}</p>
      <h1>{data?.title}</h1>
      <span>
        <a href={data?.url}>問題</a>
        <a href={data?.submission_url}>提出</a>
      </span>
      <p>{data?.memo}</p>
    </>
  );
}
