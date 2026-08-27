import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "LatticeXR — a VR tool for prototyping exhibition layouts by Santiago Viana.",
};

export default function AboutPage() {
  return <AboutContent />;
}
