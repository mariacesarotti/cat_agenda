import { Request, Response } from "express";
import { pool } from "../../db/pool";
import { calculateMedicationNeeds } from "../../services/medication.service";

export const createMedicationConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_id, med_name, dosage, frequency_days, start_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO medications (cat_id, med_name, dosage, frequency_days, start_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [cat_id, med_name, dosage, frequency_days, start_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro criando configuração de medicação:", error);
    res.status(200).json({ error: error.message });
  }
};
export const updateMedicationConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      UPDATE medications
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
    `;

  values.push(id);

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Medicação não encontrada" });
      return;
    }
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao atualizar medicação:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getMedicationConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;

  try {
    const result = await pool.query(
      `SELECT m.* FROM medications m
       JOIN cats c ON m.cat_id = c.id
       WHERE c.user_id = $1`,
      [user.id]
    );

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Erro ao buscar medicações:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getMedicationConfigByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  const { cat_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT m.* FROM medications m
       JOIN cats c ON m.cat_id = c.id
       WHERE c.user_id = $1 AND m.cat_id = $2`,
      [user.id, cat_id]
    );
    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhuma medicação encontrada para este gato." });
      return;
    } 
    const formatted = result.rows.map((med: any) => ({
      ...med,
      start_date: med.start_date
        ? new Date(med.start_date).toISOString().split("T")[0]
        : null,
      end_date: med.end_date
        ? new Date(med.end_date).toISOString().split("T")[0]
        : null,
    }));
    res.status(200).json(formatted);
  } catch (error: any) {
    console.error("Erro ao buscar medicações:", error);
    res.status(500).json({ error: error.message });
  }
};
    export const getMedicationConfigByCatId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM medications WHERE cat_id = $1",
      [cat_id]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhuma medicação encontrada para este gato." });
      return;
    }

    const formatted = result.rows.map((med: any) => ({
      ...med,
      start_date: med.start_date
        ? new Date(med.start_date).toISOString().split("T")[0]
        : null,
      end_date: med.end_date
        ? new Date(med.end_date).toISOString().split("T")[0]
        : null,
    }));

    res.status(200).json(formatted);
  } catch (error: any) {
    console.error("Erro ao buscar medicações:", error);
    res.status(500).json({ error: error.message });
  }
};
export const deleteMedicationConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM medications WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Medicação não encontrada" });
      return;
    }

    res.status(200).json({
      message: "Medicação removida com sucesso",
      deleted: result.rows[0],
    });
  } catch (error: any) {
    console.error("Erro ao deletar medicação:", error);
    res.status(500).json({ error: error.message });
  }
};
export const calculateMedication = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM medications WHERE cat_id = $1",
      [cat_id]
    );
    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhuma medicação encontrada para este gato." });
      return;
    }

    const config = result.rows;

    if (!config || config.length === 0) {
      res
        .status(404)
        .json({ error: "Configuração de medicação não encontrada!" });
      return;
    }
    const calc = calculateMedicationNeeds(config);
    res.status(200).json(calc);
  } catch (error: any) {
    console.error("Erro ao calcular medicação:", error);
    res.status(500).json({ error: error.message });
  }
};