type CardVideo = {
  path: string;
  files: string[];
};

const cardVideos: { [key: number]: CardVideo } = {
  1: {
    path: "fool",
    files: [
      "Wan_00032.mp4",
      "Wan_00054.mp4",
      "Wan_00076.mp4",
      "AnimateDiff_00423.mp4",
      "AnimateDiff_00424.mp4",
      "Wan_00098.mp4",
      "Wan_00120.mp4",
      "Wan_00163.mp4",
    ],
  },
  2: {
    path: "magician",
    files: [
      "Wan_00002.mp4",
      "Wan_00004.mp4",
      "Wan_00005.mp4",
      "Wan_00062.mp4",
      "Wan_00084.mp4",
      "Wan_00106.mp4",
      "Wan_00128.mp4",
      "Wan_00149.mp4",
    ],
  },
  3: {
    path: "high-priestess",
    files: [
      "Wan_00036.mp4",
      "Wan_00080.mp4",
      "Wan_00102.mp4",
      "Wan_00146.mp4",
      "Wan_00181.mp4",
    ],
  },
  4: {
    path: "empress",
    files: ["Wan_00097.mp4", "Wan_00162.mp4", "Wan_00177.mp4", "Wan_00192.mp4"],
  },
  5: {
    path: "emperor",
    files: ["Wan_00030.mp4", "Wan_00052.mp4", "Wan_00096.mp4"],
  },
  6: {
    path: "hierophant",
    files: ["Wan_00101.mp4", "Wan_00180.mp4"],
  },
  7: {
    path: "lovers",
    files: ["Wan_00061.mp4", "Wan_00127.mp4", "Wan_00148.mp4", "Wan_00183.mp4"],
  },
  8: {
    path: "chariot",
    files: ["Wan_00029.mp4", "Wan_00049.mp4", "Wan_00093.mp4"],
  },
  9: {
    path: "strength",
    files: ["Wan_00001.mp4", "Wan_00043.mp4", "Wan_00065.mp4"],
  },
  10: {
    path: "hermit",
    files: ["Wan_00034.mp4", "Wan_00078.mp4", "Wan_00122.mp4", "Wan_00165.mp4"],
  },
  11: {
    path: "wheel-of-fortune",
    files: ["Wan_00135.mp4", "Wan_00156.mp4"],
  },
  12: {
    path: "justice",
    files: [
      "Wan_00104.mp4",
      "Wan_00126.mp4",
      "Wan_00147.mp4",
      "Wan_00169.mp4",
      "Wan_00182.mp4",
    ],
  },
  13: {
    path: "hanged-man",
    files: ["Wan_00055.mp4", "Wan_00178.mp4"],
  },
  14: {
    path: "death",
    files: [
      "Wan_00006.mp4",
      "Wan_00007.mp4",
      "Wan_00008.mp4",
      "Wan_00010.mp4",
      "Wan_00072.mp4",
      "Wan_00094.mp4",
      "Wan_00159.mp4",
      "Wan_00175.mp4",
      "AnimateDiff_00071.mp4",
    ],
  },
  15: {
    path: "temperance",
    files: ["Wan_00067.mp4", "Wan_00133.mp4", "Wan_00154.mp4"],
  },
  16: {
    path: "devil",
    files: [
      "Wan_00073.mp4",
      "Wan_00117.mp4",
      "Wan_00160.mp4",
      "Wan_00190.mp4",
      "AnimateDiff_00416.mp4",
      "AnimateDiff_00417.mp4",
    ],
  },
  17: {
    path: "tower",
    files: [
      "Wan_00015.mp4",
      "Wan_00016.mp4",
      "Wan_00017.mp4",
      "Wan_00046.mp4",
      "AnimateDiff_00340.mp4",
      "AnimateDiff_00341.mp4",
    ],
  },
  18: {
    path: "star",
    files: [
      "Wan_00020.mp4",
      "Wan_00021.mp4",
      "Wan_00022.mp4",
      "Wan_00023.mp4",
      "Wan_00024.mp4",
      "Wan_00025.mp4",
      "Wan_00028.mp4",
      "Wan_00042.mp4",
      "Wan_00064.mp4",
      "Wan_00086.mp4",
      "Wan_00108.mp4",
      "Wan_00130.mp4",
      "Wan_00151.mp4",
      "Wan_00173.mp4",
      "AnimateDiff_00418.mp4",
    ],
  },
  19: {
    path: "moon",
    files: ["Wan_00041.mp4", "Wan_00107.mp4", "Wan_00150.mp4"],
  },
  20: {
    path: "sun",
    files: ["Wan_00044.mp4", "Wan_00066.mp4", "Wan_00153.mp4", "Wan_00187.mp4"],
  },
  21: {
    path: "judgement",
    files: ["Wan_00037.mp4", "Wan_00059.mp4", "Wan_00168.mp4"],
  },
  22: {
    path: "world",
    files: ["Wan_00070.mp4", "Wan_00114.mp4", "Wan_00136.mp4", "Wan_00157.mp4"],
  },
};

export function getVideoPath(id: number, index: number): string {
  const card = cardVideos[id];
  if (!card) {
    throw new Error(`Card not found for id ${id}`);
  }

  // インデックスが範囲外の場合は、最初のファイルを返す
  if (index < 0 || index >= card.files.length) {
    return `${card.path}/${card.files[0]}`;
  }

  return `${card.path}/${card.files[index]}`;
}
