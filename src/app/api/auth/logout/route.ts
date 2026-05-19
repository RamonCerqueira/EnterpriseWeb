import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SoftLine API] Logout endpoint error:", error);
    return NextResponse.json(
      { error: "Erro ao tentar realizar logout." },
      { status: 500 }
    );
  }
}
