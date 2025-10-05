import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ReactNode } from "react";

export default function NotFoundPage(): ReactNode {
  return (
    <div
      className={"flex flex-col items-center justify-center min-h-screen p-4"}
    >
      <div className={"text-center"}>
        <h1 className={"text-6xl font-bold text-primary mb-4"}>404</h1>
        <h2 className={"text-2xl font-semibold mb-4"}>Not Found</h2>
        <p className={"text-muted-foreground mb-8 max-w-md"}>
          Don't worry, even the best apps have sometimes problems.
        </p>
        <div className={"flex flex-col sm:flex-row justify-center gap-4"}>
          <Link
            className={
              "flex items-center justify-center px-4 py-2 bg-muted text-muted-foreground rounded-md hover:bg-primary/80 transition-colors border border-muted-foreground"
            }
            href={"/"}
          >
            <ArrowLeftIcon className={"size-4 mr-2"} />
            Go back to the home page
          </Link>
        </div>
      </div>
      <div className={"mt-12 text-center"}>
        <p className={"text-sm text-muted-foreground"}>
          If you think this is an error, contact us.
        </p>
      </div>
    </div>
  );
}
