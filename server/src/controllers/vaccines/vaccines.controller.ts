import { Request, Response } from "express";
import { pool } from "../../db/pool";
import { calculateVaccineNeeds } from "../../services/vaccines.service";

export const createVaccineConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_id } = req.body;
  const { vaccine_name, date_administered, description, frequency_days} = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO vaccines (cat_id, vaccine_name, date_administered, description, frequency_days) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [cat_id, vaccine_name, date_administered, description, frequency_days]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao adicionar vacina:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getVaccines = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM vaccines WHERE cat_id = $1",
      [cat_id]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhuma vacina encontrada para este gato." });
      return;
    }

    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Erro ao buscar vacinas:", error);
    res.status(500).json({ error: error.message });
  }
};
export const getVaccinesByCatId = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cat_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM vaccines WHERE cat_id = $1",
      [cat_id]
    );

    if (result.rows.length === 0) {
      res
        .status(404)
        .json({ error: "Nenhuma vacina encontrada para este gato." });
      return;
    }
    const formatted = result.rows.map((vaccine) => ({
      ...vaccine,
      date_administered: vaccine.date_administered
        ? new Date(vaccine.date_administered).toISOString().split("T")[0]
        : null,
    }));
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error("Erro ao buscar vacinas:", error);
    res.status(500).json({ error: error.message });
  }
};
export const updateVaccineConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { vaccine_name, date_administered, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE vaccines SET vaccine_name = $1, date_administered = $2, description = $3 WHERE id = $4 RETURNING *",
      [vaccine_name, date_administered, description, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Vacina não encontrada" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao atualizar vacina:", error);
    res.status(500).json({ error: error.message });
  }
};
export const deleteVaccineConfig = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM vaccines WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Vacina não encontrada" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error("Erro ao deletar vacina:", error);
    res.status(500).json({ error: error.message });
  }
};

export const calculateVaccine = async (
    req: Request,   
    res: Response
): Promise<void> => { 
    const { cat_id } = req.params;
    
    try {
        const result = await pool.query(
        "SELECT * FROM vaccines WHERE cat_id = $1",
        [cat_id]
        );
    
        if (result.rows.length === 0) {
        res
            .status(404)
            .json({ error: "Nenhuma vacina encontrada para este gato." });
        return;
        }
    
        const config = result.rows;
        if (!config || config.length === 0) {
        res
            .status(404)
            .json({ error: "Configuração de vacina não encontrada!" });
        return;
        }

        const calc = calculateVaccineNeeds(config);
        res.status(200).json(calc);
    } catch (error: any) {
        console.error("Erro ao calcular vacina:", error);
        res.status(500).json({ error: error.message });
    }
}