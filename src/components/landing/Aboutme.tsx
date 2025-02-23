import { ExternalLink } from "lucide-react";
import Link from "next/link";

import profile from "@/data/profile";

import { LinkComponent } from "../AboutCx";

export default function Aboutme() {
  return (
    <section className="mb-6 mt-12 rounded-xl bg-slate-900/50">
      <h2 className="mb-3 text-3xl font-bold tracking-tight text-white">About me</h2>

      <div className="space-y-4">
        <p className="leading-relaxed text-slate-200">
          Hi, I am Pulkit from <strong>India</strong> 🇮🇳. I love building stuff, and all my projects are hosted on
          <LinkComponent href={"https://github.com/" + profile.githubUserName}>GitHub</LinkComponent>. My journey began
          in 8th grade with basic HTML-CSS, and since then, I&apos;ve evolved from a curious student to a web developer
          passionate about creating impactful solutions.
        </p>

        <p className="leading-relaxed text-slate-300">
          Through consistent learning and project building, I&apos;ve grown my skills across the full stack. Currently,
          I&apos;m working remotely with exciting technologies and always looking to learn more.
        </p>

        <Link
          href="/about"
          className="mt-2 inline-flex items-center font-medium text-cyan-400 transition-colors hover:text-cyan-300"
        >
          Read more about my journey
          <ExternalLink className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
