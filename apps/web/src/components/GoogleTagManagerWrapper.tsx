"use client";

import { GoogleTagManager } from "@next/third-parties/google";

type Props = {
  gtmId: string;
};

export default function GoogleTagManagerWrapper({ gtmId }: Props) {
  // GTM_ID が空の場合は何もレンダリングしない
  if (!gtmId) {
    return null;
  }
  return <GoogleTagManager gtmId={gtmId} />;
}
