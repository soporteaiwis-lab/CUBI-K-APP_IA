import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request) {
  try {
    // Obtenemos los parámetros de la URL (por si queremos pasar ?action=getTodo)
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'getTodo';
    
    // Hacemos fetch a Google Apps Script desde el servidor (evita CORS)
    const response = await fetch(`${API_URL}?action=${action}`, {
      // Evitamos que Next.js cachee esta respuesta para tener datos en tiempo real
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en GET /api/sheet:', error);
    return NextResponse.json(
      { error: 'Error al conectar con Google Apps Script' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Apps Script prefiere text/plain para evitar preflight en algunos casos, aunque desde el server no hay CORS
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en POST /api/sheet:', error);
    return NextResponse.json(
      { error: 'Error al enviar datos a Google Apps Script' },
      { status: 500 }
    );
  }
}