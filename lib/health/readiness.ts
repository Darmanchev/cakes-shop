import "server-only";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function readyResponse() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      { status: "ready" },
      { headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("Readiness check failed", error);

    return NextResponse.json(
      { status: "not-ready" },
      {
        status: 503,
        headers: NO_STORE_HEADERS,
      },
    );
  }
}
