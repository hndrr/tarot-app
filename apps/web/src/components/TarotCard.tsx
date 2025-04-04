import Image from "next/image";

type TarotCardProps = {
  card: {
    id: number;
    name: string;
    image: string;
    meaning: string;
  };
  isReversed: boolean;
};

export default function TarotCard({ card, isReversed }: TarotCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative aspect-[2/3] w-64 mb-6 ${
          isReversed && "rotate-180"
        }`}
      >
        <Image
          src={card.image}
          alt={card.name}
          fill
          className="rounded-lg object-cover shadow-lg"
          priority
        />
      </div>
      <h3 className="text-3xl font-bold mb-3">{card.name}</h3>
      <span className="text-xl text-gray-200 mb-3 font-bold">
        {isReversed ? "逆位置" : "正位置"}
      </span>
      <p className="text-xl text-gray-200">{card.meaning}</p>
    </div>
  );
}
