import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { WiAlien } from "react-icons/wi";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:6rem_4rem]" />
      <section className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-10 text-center">
        <header className="space-y-6">
          <div className="flex justify-center -mb-2">
            <WiAlien className="w-28 h-28" />
          </div>
          <h1 className="text-5xl font-semibold sm:text-7xl text-zinc-900">
            Alien AI Agent
          </h1>
          <p className="max-w-[600px] text-lg text-gray-600 md:text-xl xl:text-xl mx-auto font-light">
            Meet the best AI chat companion that goes beyond conversation. It
            can really get things done!
          </p>
          <span className="text-gray-400 text-sm">
            Powered by IBM&apos;s WxTools & your favorite LLM&apos;s.
          </span>
        </header>
        <SignedIn>
          <Link href="/dashboard">
            <button
              type="button"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 rounded-full hover:from-gray-700 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:translate-y-0.5 cursor-pointer"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </SignedIn>

        <SignedOut>
          <SignInButton
            mode="modal"
            fallbackRedirectUrl={"/dashboard"}
            forceRedirectUrl={"/dashboard"}
          >
            <button
              type="button"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-gray-900 to-gray-800 rounded-full hover:from-gray-700 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:translate-y-0.5 cursor-pointer"
            >
              Sign Up
              <ArrowRight className="ml-1 mt-0.5 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-900/20 to-gray-800/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </SignInButton>
        </SignedOut>
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 pt-2 max-w-3xl mx-auto">
          {[
            { title: "Fast", description: "Real-time streamed responses" },
            {
              title: "Modern",
              description: "Next.js 15, TailwindCSS, Convex, Clerk",
            },
            { title: "Smart", description: "Powered by your favorite LLM's" },
          ].map(({ title, description }) => (
            <div
              key={title}
              // className="text-center bg-white/20 backdrop-blur-md px-2 py-4 rounded-2xl border border-white/30 shadow-lg transition-all hover:bg-white/30 hover:border-white/50"
              className="text-center p-6 rounded-2xl backdrop-blur-lg bg-gradient-to-br from-white/10 to-white/30 border border-white/30 shadow-lg shadow-zinc-500/20 transition-all hover:bg-white/30 hover:border-white/50 hover:shadow-zinc-500/30"
            >
              <div className="text-2xl font-semibold text-gray-900">
                {title}
              </div>
              <div className="text-sm text-gray-600 mt-1 tracking-wide">
                {description}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
