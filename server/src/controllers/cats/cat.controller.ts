import { Request, Response } from "express";
import { pool } from "../../db/pool";

export const createCat = async (req: Request, res: Response) => {
  try {
    const { name, age_category } = req.body;
    const user_id = (req as any).user.id; // <-- PEGA do token!

    const result = await pool.query(
      "INSERT INTO cats (name, age_category, user_id) VALUES ($1, $2, $3) RETURNING *",
      [name, age_category, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao criar gato:", error);
    res.status(500).json({ error: "Erro ao criar gato" });
  }
};
export const getCatsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  console.log("Header Authorization recebido:", req.headers["authorization"]);
  console.log("ID do usuário recebido:", userId);
  console.log("ID do usuário recebido:", (req as any).user.id);
  try {
    const result = await pool.query(
      "SELECT * FROM cats WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar gatos do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar gatos do usuário" });
  }
};

export const getCats = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user;
  try {
    const result = await pool.query("SELECT * FROM cats WHERE user_id = $1", [
      user.id]);
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Error fetching cats:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCatById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM cats WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "gato não encontrado!" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error fetching cat:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCat = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM cats WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Gato não encontrado" });
      return;
    }

    res
      .status(200)
      .json({ message: "Gato removido com sucesso", deleted: result.rows[0] });
  } catch (error: any) {
    console.error("Erro ao deletar gato:", error);
    res.status(500).json({ error: error.message });
  }
};
export const updateCat = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  const fields: string[] = [];
  const values: any[] = [];

  let index = 1;
  for (const key in updates) {
    fields.push(`${key} = $${index}`);
    values.push(updates[key]);
    index++;
  }

  if (fields.length === 0) {
    res.status(400).json({ error: "Nenhum campo fornecido para atualização." });
    return;
  }

  const query = `
    UPDATE cats
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  values.push(id);

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Gato não encontrado" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao atualizar gato:", error);
    res.status(500).json({ error: error.message });
  }
};
