'use client';
import Image from "next/image";

import MainPage from '@/components/search'
import './globals.css'



export default function Home() {

  return (
    <div>
      <main>
        <div>
          <MainPage />
        </div>
      </main>
    </div>
  );
}
