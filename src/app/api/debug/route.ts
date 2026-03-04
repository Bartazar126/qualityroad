import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const redisUrl   = process.env.UPSTASH_REDIS_REST_URL   ?? process.env.KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  const cloudName  = process.env.CLOUDINARY_CLOUD_NAME;
  const cloudKey   = process.env.CLOUDINARY_API_KEY;
  const cloudSec   = process.env.CLOUDINARY_API_SECRET;

  let redisStatus = "❌ Nincs beállítva";
  if (redisUrl && redisToken) {
    try {
      const { Redis } = await import("@upstash/redis");
      const redis = new Redis({ url: redisUrl, token: redisToken });
      await redis.ping();
      redisStatus = "✅ Kapcsolódva";
    } catch (e) {
      redisStatus = `❌ Hiba: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return NextResponse.json({
    redis:     { status: redisStatus, url: redisUrl ? redisUrl.slice(0, 40) + "…" : null },
    cloudinary: {
      cloud_name: cloudName ? "✅ " + cloudName : "❌ Nincs beállítva",
      api_key:    cloudKey  ? "✅ " + cloudKey.slice(0, 6) + "…"  : "❌ Nincs beállítva",
      api_secret: cloudSec  ? "✅ beállítva"  : "❌ Nincs beállítva",
    },
    node_env: process.env.NODE_ENV,
  });
}
