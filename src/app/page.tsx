import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-8 text-center h-full">
      <Image src="/logo.png" alt="MPHM Logo" width={120} height={120} className="mb-6" />
      <h1 className="text-4xl font-bold mb-4">MPHM</h1>
      <p className="text-zinc-500 text-lg max-w-lg">
        Madrasah Putri Hidayatul Mubtadi&apos;at - Sistem Informasi Akademik
      </p>
    </div>
  );
}
