import { jwtVerify, SignJWT } from "jose";

// Bu dosya hem middleware (Edge runtime) hem de normal Node.js kodundan
// import edilir, bu yüzden "next/headers" gibi Node/Server-Component'e
// özel API'ler burada KULLANILMAZ.

export const SESSION_COOKIE_NAME = "admin_session";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET env var tanımlı değil");
  }
  return new TextEncoder().encode(secret);
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function signSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}
