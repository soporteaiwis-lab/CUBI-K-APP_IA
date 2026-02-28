import { NextResponse } from 'next/server';

// ESTO ES CRÍTICO: Obliga a Next.js a no usar caché y consultar en tiempo real
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "getTodo";
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!API_URL) {
    return NextResponse.json({ success: false, error: "Falta NEXT_PUBLIC_API_URL en Vercel" }, { status: 500 });
  }

  try {
    // Añadimos cache: 'no-store' por doble seguridad
    const res = await fetch(`${API_URL}?action=${action}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error de red al conectar con Google Sheets" }, { status: 500 });
  }
}

export async function POST(request) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const body = await request.json();
    const res = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}