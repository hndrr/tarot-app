import { getVideoPath } from "@/lib/videoPath";

export type CardVideoData = {
  id: number;
  name: string;
  videos: string[];
};

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export const cardVideos: CardVideoData[] = [
  {
    id: 1,
    name: "愚者",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(1, index)}`),
  },
  {
    id: 2,
    name: "魔術師",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(2, index)}`),
  },
  {
    id: 3,
    name: "女教皇",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(3, index)}`),
  },
  {
    id: 4,
    name: "女帝",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(4, index)}`),
  },
  {
    id: 5,
    name: "皇帝",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(5, index)}`),
  },
  {
    id: 6,
    name: "教皇",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(6, index)}`),
  },
  {
    id: 7,
    name: "恋人",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(7, index)}`),
  },
  {
    id: 8,
    name: "戦車",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(8, index)}`),
  },
  {
    id: 9,
    name: "力",
    videos: [29, 30, 31].map((index) => `${CDN_URL}/${getVideoPath(9, index)}`),
  },
  {
    id: 10,
    name: "隠者",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(10, index)}`
    ),
  },
  {
    id: 11,
    name: "運命の輪",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(11, index)}`
    ),
  },
  {
    id: 12,
    name: "正義",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(12, index)}`
    ),
  },
  {
    id: 13,
    name: "吊るされた男",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(13, index)}`
    ),
  },
  {
    id: 14,
    name: "死神",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(14, index)}`
    ),
  },
  {
    id: 15,
    name: "節制",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(15, index)}`
    ),
  },
  {
    id: 16,
    name: "悪魔",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(16, index)}`
    ),
  },
  {
    id: 17,
    name: "塔",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(17, index)}`
    ),
  },
  {
    id: 18,
    name: "星",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(18, index)}`
    ),
  },
  {
    id: 19,
    name: "月",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(19, index)}`
    ),
  },
  {
    id: 20,
    name: "太陽",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(20, index)}`
    ),
  },
  {
    id: 21,
    name: "審判",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(21, index)}`
    ),
  },
  {
    id: 22,
    name: "世界",
    videos: [29, 30, 31].map(
      (index) => `${CDN_URL}/${getVideoPath(22, index)}`
    ),
  },
];
