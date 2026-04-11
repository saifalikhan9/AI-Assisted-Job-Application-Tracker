import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

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

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: string;
      email?: string;
    };
    // Ensure both userId and email exist and are strings
    if (typeof decoded.userId === "string" && typeof decoded.email === "string") {
      return { userId: decoded.userId, email: decoded.email };
    }
    return null;
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    return null;
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
    if (!decoded) return null;
    return decoded;
  } catch {
    return null;
  }
}
