"use client";
export const dynamic = "force-dynamic";
import { useSession, signOut } from "next-auth/react";

export default function Main_page() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className='p-6'>Loading...</div>;
  }

  if (!session) {
    return (
      <div className='p-6'>
        <p>You are not signed in</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <header className='bg-white shadow-sm border-b border-gray-200'>
        <div className='flex items-center justify-between px-6 py-4'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Admin Dashboard
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <img
                src={session?.user?.image || "/api/placeholder/40/40"}
                alt='PP'
                className='w-10 h-10 rounded-full border-2 border-gray-300'
              />
              <div className='hidden md:block'>
                <p className='text-sm font-medium text-gray-900'>
                  {session?.user?.name}
                </p>
                <p className='text-xs text-gray-500'>{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className='px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200'
            >
              Logout
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}
