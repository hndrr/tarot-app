import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 to-indigo-900 text-white flex flex-col justify-between py-10">
      <main className="w-full flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">タロット占い</h1>
        <div className="relative mb-8 aspect-square w-[90%] max-w-[500px]">
          <Image
            src="/assets/cover.png"
            alt="タロットカード"
            fill
            className="rounded-lg object-cover"
            priority
          />
        </div>
        <p className="text-xl mb-8 text-purple-200">今日のあなたの運勢は...?</p>
        <Link
          className="bg-purple-600 hover:bg-purple-700 py-4 px-8 text-lg mb-8 rounded-full text-white font-bold transition duration-300"
          href="/intro"
        >
          入室する
        </Link>
      </main>
      <footer className="h-16 text-white flex items-center">
        <div className="w-4/5 max-w-3xl mx-auto flex justify-between items-center flex-col gap-2">
          <div className="flex gap-4 items-center flex-col">
            <Link
              href="https://play.google.com/store/apps/details?id=com.hndr.tarrotappexpo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/googleplay.png"
                alt="Google Play"
                width={160}
                height={47.5}
                className="object-contain"
              />
            </Link>
            <Link
              className="text-blue-400 underline hover:text-blue-800"
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              プライバシーポリシー
            </Link>
          </div>
          <p>© 2025 Tarotie</p>
        </div>
      </footer>
    </div>
  );
}
