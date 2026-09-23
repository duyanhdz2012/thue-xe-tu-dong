import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8080";

async function proxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const targetUrl = new URL(`/api/${path.join("/")}`, BACKEND_URL);

  req.nextUrl.searchParams.forEach((val, key) => {
    targetUrl.searchParams.set(key, val);
  });

  const headers = new Headers();
  req.headers.forEach((val, key) => {
    const k = key.toLowerCase();
    // Bỏ các headers liên quan đến origin và host của client để backend Spring Boot không kiểm tra CORS
    if (!["host", "origin", "referer", "content-length", "connection"].includes(k)) {
      headers.set(key, val);
    }
  });

  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer();

  try {
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body,
    });

    const resHeaders = new Headers();
    response.headers.forEach((val, key) => {
      resHeaders.set(key, val);
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Không thể kết nối tới Backend Spring Boot", error: (error as Error).message },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const DELETE = proxy;
export const PATCH = proxy;
