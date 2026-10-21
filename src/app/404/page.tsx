import type { Metadata } from "next";
import NotFound from "../not-found";

export const metadata: Metadata = {
  title: "Page Not Found | SigSignature",
  description: "The page you are looking for does not exist on SigSignature.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Error404Page() {
  return <NotFound />;
}
