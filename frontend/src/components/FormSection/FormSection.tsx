import React, { useState } from "react";
import {
  createCat,
  createLitterConfig,
  createFoodConfig,
  createMedicationConfig,
  createVaccinationConfig,
} from "../../api/catCalendarApi";

import "./FormSection.scss";

interface CatInfo {
  name: string;
  age_category: "filhote" | "adulto" | "senior";
}

interface FormData {
  cats: CatInfo[];
  litterConfig?: {
    num_of_boxes: number;
    type_of_litter: string;
  };
  foodConfig?: {
    brand: string;
    type_of_food: string;
  };
  medicationConfig?: {
    med_name: string;
    dosage: string;
    frequency_days: number;
  };
  vaccinationConfig?: {
    vaccine_name: string;
    date_administered: string;
    description: string;
    frequency_days: number;
  };
}

interface FormSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmitForm: (event: any) => void;
}

const FormSection: React.FC<FormSectionProps> = ({ onSubmitForm }) => {
  const [step, setStep] = useState(1);
  const [numberOfCats, setNumberOfCats] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    cats: [],
  });

  const handleNext = () => {
    const currentForm = document.querySelector(".form-content");
    if (currentForm) {
      const isValid = (currentForm as HTMLFormElement).checkValidity();
      if (!isValid) {
        (currentForm as HTMLFormElement).reportValidity();
        return;
      }
    }
    setStep((prev) => prev + 1);
  };
  const handlePrevious = () => setStep((prev) => prev - 1);

  const handleCatChange = (
    index: number,
    field: keyof CatInfo,
    value: string
  ) => {
    const updatedCats = [...formData.cats];
    updatedCats[index] = { ...updatedCats[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      cats: updatedCats,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: string,
    field: string
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("Usuário não logado.");
      }

      const catIds: number[] = [];
      for (const cat of formData.cats) {
        const newCat = await createCat(
          cat.name,
          cat.age_category,
          Number(userId)
        );
        catIds.push(newCat.id);
      }

      if (formData.litterConfig) {
        await createLitterConfig({
          user_id: Number(userId),
          num_of_boxes: formData.litterConfig.num_of_boxes,
          num_of_cats: formData.cats.length,
          type_of_litter: formData.litterConfig.type_of_litter,
          last_full_change: new Date().toISOString().split("T")[0],
        });
      }

      if (formData.foodConfig) {
        for (const catId of catIds) {
          await createFoodConfig({
            cat_id: catId,
            brand: formData.foodConfig.brand,
            type: formData.foodConfig.type_of_food,
            age_category: formData.cats[0].age_category,
            num_of_cats: formData.cats.length,
            user_id: Number(userId),
            start_date: new Date().toISOString().split("T")[0],
          });
        }
      }

      if (formData.medicationConfig?.med_name) {
        for (const catId of catIds) {
          await createMedicationConfig({
            cat_id: catId,
            med_name: formData.medicationConfig.med_name,
            dosage: formData.medicationConfig.dosage,
            frequency_days: Number(formData.medicationConfig.frequency_days),
            start_date: new Date().toISOString().split("T")[0],
            user_id: Number(userId),
          });
        }
      }

      if (formData.vaccinationConfig?.vaccine_name) {
        for (const catId of catIds) {
          await createVaccinationConfig({
            cat_id: catId,
            vaccine_name: formData.vaccinationConfig.vaccine_name,
            date_administered: formData.vaccinationConfig.date_administered,
            description: formData.vaccinationConfig.description,
            frequency_days: 365, // vacina é sempre anual
            user_id: Number(userId),
          });
        }
      }

      // Buscar eventos do calendário do backend para garantir sincronização
      const response = await fetch(`/calendar/${userId}`);
      const events = await response.json();
      onSubmitForm(events);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erro ao gerar calendário:", error.message);
      } else {
        console.error("Erro ao gerar calendário:", error);
      }
    }
  };

  return (
    <section className="form-container">
      <h2 className="form-title">
        fill this out so we can pretend you're in charge.
      </h2>

      <form onSubmit={handleSubmit} className="form-content">
        {/* ETAPA 1: GATOS */}
        {step === 1 && (
          <>
            <div className="form-question--numberofcats">
              <label htmlFor="numberOfCats">
                how many cats claim you as their human?
              </label>
              <input
                title="numberOfCats"
                id="numberOfCats"
                placeholder="0"
                type="number"
                value={numberOfCats === 0 ? "" : numberOfCats}
                min={1}
                onChange={(e) => {
                  const rawValue = e.target.value;

                  // Allow input to be temporarily empty while typing
                  if (rawValue === "") {
                    setNumberOfCats(0);
                    setFormData((prev) => ({ ...prev, cats: [] }));
                    return;
                  }

                  const parsed = parseInt(rawValue, 10);

                  if (!isNaN(parsed) && parsed > 0) {
                    setNumberOfCats(parsed);

                    // Use Array.from to avoid reference issues
                    const newCats = Array.from({ length: parsed }, () => ({
                      name: "",
                      age_category: "filhote",
                    })) as CatInfo[];
                    setFormData((prev) => ({ ...prev, cats: newCats }));
                  }
                }}
                required
              />
            </div>
            {formData.cats.map((cat, index) => (
              <div
                key={index}
                className="form-question--catname border p-4 rounded shadow-md bg-gray-100"
              >
                <input
                  type="text"
                  placeholder={`cat ${index + 1} name`}
                  value={cat.name}
                  onChange={(e) =>
                    handleCatChange(index, "name", e.target.value)
                  }
                  required
                />
                <select
                  value={cat.age_category}
                  onChange={(e) =>
                    handleCatChange(index, "age_category", e.target.value)
                  }
                  required
                >
                  <option value="filhote">kitten (under 12 months)</option>
                  <option value="adulto">adult (1-7 years)</option>
                  <option value="senior">senior (7+ years)</option>
                </select>
              </div>
            ))}
          </>
        )}

        {/* ETAPA 2: AREIA */}
        {step === 2 && (
          <>
            <div className="form-question--numberoflitterboxes">
              <label htmlFor="numberOfLitterBoxes">
                how many litter boxes are under their reign?
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.litterConfig?.num_of_boxes || ""}
                min={1}
                onChange={(e) => {
                  const rawValue = e.target.value;

                  // Allow input to be temporarily empty while typing
                  if (rawValue === "") {
                    setFormData((prev) => ({
                      ...prev,
                      litterConfig: { num_of_boxes: 0, type_of_litter: "" },
                    }));
                    return;
                  }

                  const parsed = parseInt(rawValue, 10);

                  if (!isNaN(parsed) && parsed > 0) {
                    setFormData((prev) => ({
                      ...prev,
                      litterConfig: {
                        ...prev.litterConfig,
                        num_of_boxes: parsed,
                        type_of_litter: prev.litterConfig?.type_of_litter || "",
                      },
                    }));
                  }
                }}
                required
              />
            </div>
            <div className="form-question--littertype-container">
              <label htmlFor="type_of_litter">litter of choice: </label>
              <select
                value={formData.litterConfig?.type_of_litter || ""}
                onChange={(e) =>
                  handleChange(e, "litterConfig", "type_of_litter")
                }
                required
              >
                <option value=""></option>
                <option value="sílica">silic</option>
                <option value="biodegradável">bio</option>
                <option value="comum">common</option>
              </select>
            </div>
          </>
        )}
        {/* ETAPA 3: COMIDA */}
        {step === 3 && (
          <>
            <div className="form-question--foodbrand">
              <label htmlFor="foodConfig">
                what brand of foods have they accepted?
              </label>
              <input
                type="text"
                placeholder="brands"
                value={formData.foodConfig?.brand || ""}
                onChange={(e) => handleChange(e, "foodConfig", "brand")}
                required
              />
            </div>
            <div className="form-question--foodtype-container">
              <label htmlFor="type_of_food">preferred format of food: </label>
              <select
                value={formData.foodConfig?.type_of_food || ""}
                onChange={(e) => handleChange(e, "foodConfig", "type_of_food")}
                required
              >
                <option value=""></option>
                <option value="seca">dry</option>
                <option value="umida">wet</option>
                <option value="seca+umida">dry + wet</option>
                <option value="natural">natural</option>
              </select>
            </div>
          </>
        )}

        {/* ETAPA 4: MEDICAÇÃO (opcional) */}
        {step === 4 && (
          <>
            <div className="form-question--medicationname">
              <label htmlFor="medication_name">
                any medication they’ve agreed to take?
              </label>
              <input
                type="text"
                placeholder="med name"
                value={formData.medicationConfig?.med_name || ""}
                onChange={(e) =>
                  handleChange(e, "medicationConfig", "med_name")
                }
              />
            </div>

            <div className="form-question--medicationdosage">
              <label htmlFor="dosage">dosage instructions:</label>
              <input
                type="text"
                placeholder="e.g. 5ml, 1 pill"
                value={formData.medicationConfig?.dosage || ""}
                onChange={(e) => handleChange(e, "medicationConfig", "dosage")}
              />
            </div>

            <div className="form-question--medicationfrequency">
              <label htmlFor="frequency_days">how often? (in days)</label>
              <input
                type="number"
                placeholder="e.g. every 3 days"
                value={formData.medicationConfig?.frequency_days || ""}
                onChange={(e) =>
                  handleChange(e, "medicationConfig", "frequency_days")
                }
              />
            </div>
          </>
        )}

        {/* ETAPA 4.b: VACINAÇÃO (opcional) */}
        {step === 5 && (
          <>
            <div className="form-question--vaccinename">
              <label htmlFor="vaccine_name">
                name of the vaccine they bravely endured:
              </label>
              <input
                type="text"
                placeholder="vaccine name"
                value={formData.vaccinationConfig?.vaccine_name || ""}
                onChange={(e) =>
                  handleChange(e, "vaccinationConfig", "vaccine_name")
                }
              />
            </div>

            <div className="form-question--vaccinedate">
              <label htmlFor="date_administered">
                when was it administered?
              </label>
              <input
                type="date"
                placeholder="YYYY-MM-DD"
                value={formData.vaccinationConfig?.date_administered || ""}
                onChange={(e) =>
                  handleChange(e, "vaccinationConfig", "date_administered")
                }
              />
            </div>

            <div className="form-question--vaccinefrequency">
              <label htmlFor="frequency_days">
                renewal frequency (in days):
              </label>
              <input
                type="number"
                placeholder="usually once a year"
                value={formData.vaccinationConfig?.frequency_days || ""}
                onChange={(e) =>
                  handleChange(e, "vaccinationConfig", "frequency_days")
                }
              />
            </div>

            <div className="form-question--vaccinedescription">
              <label htmlFor="description">any extra notes? (optional)</label>
              <input
                type="text"
                placeholder="optional notes"
                value={formData.vaccinationConfig?.description || ""}
                onChange={(e) =>
                  handleChange(e, "vaccinationConfig", "description")
                }
              />
            </div>
          </>
        )}

        {/* ETAPA 5: CONFIRMAÇÃO */}
        {step === 6 && (
          <div>
            <h3 className="form-confirmation--title">
              ready to submit your intel?
            </h3>
            <div className="form-summary">
              <p>
                <strong>cats:</strong> {formData.cats.length}
              </p>

              {formData.litterConfig && (
                <p>
                  <strong>litter:</strong> {formData.litterConfig.num_of_boxes}{" "}
                  box(es), {formData.litterConfig.type_of_litter}
                </p>
              )}

              {formData.foodConfig && (
                <p>
                  <strong>food:</strong> {formData.foodConfig.brand} (
                  {formData.foodConfig.type_of_food})
                </p>
              )}

              {formData.medicationConfig?.med_name && (
                <p>
                  <strong>meds:</strong> {formData.medicationConfig.med_name},{" "}
                  {formData.medicationConfig.dosage}, every{" "}
                  {formData.medicationConfig.frequency_days} days
                </p>
              )}

              {formData.vaccinationConfig?.vaccine_name && (
                <p>
                  <strong>vaccine:</strong>{" "}
                  {formData.vaccinationConfig.vaccine_name} on{" "}
                  {formData.vaccinationConfig.date_administered}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Botões */}
        <div className="form-button--container flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="form-submit-button"
            >
              back
            </button>
          )}
          {step < 6 && (
            <button
              type="button"
              onClick={handleNext}
              className="form-submit-button"
            >
              next
            </button>
          )}
          {step === 6 && (
            <button
              type="submit"
              className="form-submit-button"
            >
              launch operation
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default FormSection;
