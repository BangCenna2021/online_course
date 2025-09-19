"use client";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Chrome,
  Github,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      if (session.user.role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/main_page");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <p className='p-6'>Loading...</p>;
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <div className='min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
      <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

      <div className='absolute top-1/4 -left-12 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse'></div>
      <div
        className='absolute bottom-1/4 -right-12 w-72 h-72 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse'
        style={{ animationDelay: "1s" }}
      ></div>

      <div className='absolute inset-0'>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className='absolute animate-float opacity-30'
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          >
            <div className='w-1 h-1 bg-white rounded-full'></div>
          </div>
        ))}
      </div>

      <div className='relative z-10 w-full max-w-md mx-4'>
        <div className='backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-6 shadow-lg'>
              <Lock className='w-7 h-7 text-white' />
            </div>
            <h1 className='text-3xl font-bold text-white mb-2'>
              Login to Your Account
            </h1>
          </div>

          <div className='space-y-6'>
            <div className='grid grid-cols-2 gap-3'>
              <button
                onClick={() => signIn("google", { prompt: "select_account" })}
                className='flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-200'
              >
                <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                  <path
                    fill='currentColor'
                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  />
                  <path
                    fill='currentColor'
                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  />
                  <path
                    fill='currentColor'
                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  />
                  <path
                    fill='currentColor'
                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  />
                </svg>
                <span className='text-sm'>Google</span>
              </button>
              <button className='flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-200'>
                <Github className='w-5 h-5 mr-2' />
                <span className='text-sm'>GitHub</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className='mt-8 text-center'>
          <div className='inline-flex items-center space-x-1 text-gray-500 text-xs'>
            <Sparkles className='w-3 h-3' />
            <span>Secured with end-to-end encryption</span>
            <Sparkles className='w-3 h-3' />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-10px) translateX(10px);
            opacity: 0.8;
          }
          66% {
            transform: translateY(5px) translateX(-5px);
            opacity: 0.5;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
