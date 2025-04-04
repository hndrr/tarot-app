import Image from "next/image";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/mystic-background.jpg"
          alt="背景"
          fill
          className="object-cover opacity-70"
        />
      </div>

      {/* star */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="absolute bg-white rounded-full opacity-70 animate-pulse"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      {/* main */}
      <div className="flex flex-col items-center z-10">
        <div className="relative w-40 h-40 mb-4">
          <Image
            src="/assets/crystal-ball.png"
            alt="水晶玉"
            fill
            className="animate-spin-slow object-contain opacity-80"
          />
        </div>

        {/* text */}
        <p className="ml-6 mt-6 text-amber-200 text-2xl animate-fade font-bold bg-black bg-opacity-40 px-2 py-1.5 rounded-md">
          あなたの運命を占っています...
        </p>
      </div>
    </div>
  );
}
