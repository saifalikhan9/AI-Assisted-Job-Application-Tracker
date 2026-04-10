import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

// 🔐 Sign JWT
export function signToken(payload: { userId: string; email: string }) {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d",
    });
  } catch (error) {
    console.error("JWT SIGN ERROR:", error);
    throw new Error("Failed to generate token");
  }
}

// 🔍 Verify JWT
export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };

    return decoded;
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    // throw new Error("Invalid or expired token");
  }
}

export async function getUserFromRequest(
  req: Request,
): Promise<{ userId: string; email: string } | null> {
  try {
    const cookie = req.headers.get("cookie");
    if (!cookie) return null;

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return null;

    const decoded = verifyToken(token);
    return decoded;
  } catch {
    return null;
  }
}
