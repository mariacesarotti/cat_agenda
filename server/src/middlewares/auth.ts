import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  id: number;
  name: string;
  email: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.AUTH_ENABLED === "false") {
    // Se auth estiver desativada, pula direto pro controller
    console.log("🔓 Autenticação desativada para ambiente de desenvolvimento.");
    (req as any).user = { id: 1, name: "Dev User", email: "devuser@example.com" }; // Simulação de login
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token inválido." });
  }
};
