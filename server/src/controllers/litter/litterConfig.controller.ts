import { Request, Response } from "express";
import { pool } from "../../db/pool";
import { calculateLitterNeeds } from "../../services/litter.service";

export const createLitterConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const {
    type_of_litter,
    num_of_cats,
    num_of_boxes,
    last_full_change,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO litter_config (user_id, type_of_litter, num_of_cats, num_of_boxes, last_full_change) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user.id, type_of_litter, num_of_cats, num_of_boxes, last_full_change]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Error creating litter config:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateLitterConfig = async (req: Request, res: Response) => {
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
    UPDATE litter_config
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
  `;

  values.push(id);

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Configuração não encontrada." });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao atualizar configuração:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getLitterConfigByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;


  try {
    const result = await pool.query(
      "SELECT * FROM litter_config WHERE user_id = $1",
      [user.id]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhuma configuração encontrada para este usuário!" });
      return;
    }

    const config = result.rows[0];

    const formatted = {
      id: config.id,
      user_id: config.user_id,
      type_of_litter: config.type_of_litter,
      num_of_cats: config.num_of_cats,
      num_of_boxes: config.num_of_boxes,
      last_full_change: new Date(config.last_full_change).toISOString().split("T")[0]
    };

    res.status(200).json(formatted);
  } catch (error: any) {
    console.error("Erro ao buscar configuração de areia:", error);
    res.status(500).json({ error: error.message });
  }
};


export const getLitterCalculation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM litter_config WHERE user_id = $1", [user_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "nenhuma configuracao encontrada" });
      return;
    }

    const config = result.rows[0];
    const calc = calculateLitterNeeds({
      type_of_litter: config.type_of_litter,
      num_of_cats: config.num_of_cats,
      num_of_boxes: config.num_of_boxes,
    });

    res.status(200).json(calc);
  } catch (error: any) {
    console.error("Erro ao calcular necessidades de areia:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getAllLitterConfigs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query("SELECT * FROM litter_config");

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Erro ao buscar todas as configurações de areia:", error);
    res.status(500).json({ error: error.message });
  }
};
