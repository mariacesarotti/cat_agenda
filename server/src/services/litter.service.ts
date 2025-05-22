interface LitterCalculationInput {
  type_of_litter: string;
  num_of_cats: number;
  num_of_boxes: number;
}

interface LitterCalculationOutput {
  litterNeededKgPerMonth: number;
  litterBagsToBuy: number;
  fullChangeFrequencyDays: number;
}

export const calculateLitterNeeds = ({
  type_of_litter,
  num_of_cats,
  num_of_boxes,
}: LitterCalculationInput): LitterCalculationOutput => {
  // Defensive: defaults
  const safeType = (type_of_litter || "").toLowerCase();
  const cats = Number(num_of_cats) > 0 ? Number(num_of_cats) : 1;
  const boxes = Number(num_of_boxes) > 0 ? Number(num_of_boxes) : 1;

  let kgPerBox: number;
  let changeFrequency: number;

  // Calculate the required number of litter boxes based on the number of cats
  const requiredBoxes = Math.ceil(cats * 1.5);

  // Use the higher value between the provided number of boxes and the required boxes
  const effectiveNumOfBoxes = Math.max(boxes, requiredBoxes);

  switch (safeType) {
    case "sílica":
      kgPerBox = 2;
      changeFrequency = 20;
      break;
    case "biodegradável":
      kgPerBox = 3;
      changeFrequency = 15;
      break;
    default: // comum
      kgPerBox = 4;
      changeFrequency = 7;
      break;
  }

  const totalChangesPerMonth = Math.ceil(30 / changeFrequency);
  const litterNeededKgPerMonth = kgPerBox * effectiveNumOfBoxes * totalChangesPerMonth;
  const litterBagsToBuy = Math.ceil(litterNeededKgPerMonth / 4); // sacos de 4kg

  return {
    litterNeededKgPerMonth,
    litterBagsToBuy,
    fullChangeFrequencyDays: changeFrequency,
  };
};
