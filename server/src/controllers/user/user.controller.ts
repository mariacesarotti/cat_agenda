import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { pool } from "../../db/pool";
import jwt from "jsonwebtoken";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(201).json({
      token,
      user: {
      id: result.rows[0].id,
      name: result.rows[0].name,
      email: result.rows[0].email,
  }
    });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const {name}  = req.params;

  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);

    const user = result.rows[0];

    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }
    console.log("📦 Senha salva no banco:", user.password);
    console.log("🔐 Senha enviada pelo usuário:", password);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Senha incorreta." });
      return;
    }
    const secret = process.env.JWT_SECRET as string;
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      secret,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        "esse é o meu id": user.id,
        "esse é o meu nome": user.name,
      },
    });
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "usuário não encontrado!" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "usuário não encontrado!" });
    }
    res.status(204).send();
  } catch (error: any) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
      [name, email, hashedPassword, id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "usuário não encontrado!" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ error: error.message });
  }
};
