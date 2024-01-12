'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Index() {
  // const router = useRouter();

  // useEffect(() => {
  //     router.push('/home');
  // }, []);

  return  (
    <div className="flex flex-col items-center justify-center">
        <h1 className="mx-auto text-center font-extrabold tracking-tight text-white space-y-8"> Doro</h1>
    </div>
  )
}
