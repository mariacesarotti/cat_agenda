import { Request, Response } from "express";
import { pool } from "../../db/pool";
import { calculateFoodNeeds } from "../../services/food.service";
export const createFoodConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_id, brand, type, start_date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO foods (cat_id, brand, type, start_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [cat_id, brand, type, start_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating foods config:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateFoodConfig = async (req: Request, res: Response): Promise<void> => {
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
    UPDATE foods
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  values.push(id);

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Configuração de ração não encontrada!" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao atualizar configuração de ração:", error);
    res.status(500).json({ error: error.message });
  }
};


export const getFoodConfigByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
 const user = (req as any).user;

  try {
    const result = await pool.query(
      "SELECT * FROM foods WHERE cat_id IN (SELECT id FROM cats WHERE user_id = $1)",
      [user.id]
    );
    const formatted = result.rows.map((food: any) => ({
      ...food,
      start_date: food.start_date
        ? new Date(food.start_date).toISOString().split("T")[0]
        : null,
      end_date: food.end_date
        ? new Date(food.end_date).toISOString().split("T")[0]
        : null
    }));
    
    res.status(200).json(formatted);
  } catch (error: any) {
    console.error("Error fetching food config:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getFoodCalculation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;

  try {
    const result = await pool.query(
      `SELECT f.*, c.age_category 
       FROM foods f
       JOIN cats c ON f.cat_id = c.id
       WHERE c.user_id = $1`,
      [user.id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Nenhuma configuração de ração encontrada!" });
      return;
    }

    const calculations = result.rows.map((config: any) =>
      calculateFoodNeeds({
        age_category: config.age_category,
        type: config.type,
        num_of_cats: 1 // cada ração corresponde a um gato, então 1 por vez
      })
    );

    res.status(200).json(calculations);
  } catch (error: any) {
    console.error("Erro ao calcular necessidades de comida:", error);
    res.status(500).json({ error: error.message });
  }
};
