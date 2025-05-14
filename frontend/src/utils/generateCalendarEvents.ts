export const generateCalendarEvents = (formData: FormData, monthsAhead = 12): Event[] =>{
    const generatedEvents: Event[] = [];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + monthsAhead);
  
    if (formData.cats.length > 0 && formData.foodConfig) {
      const foodFrequency = getFoodFrequency(formData.foodConfig.type_of_food);
      for (const cat of formData.cats) {
        const currentDate = new Date();
        while (currentDate <= endDate) {
          generatedEvents.push({
            date: currentDate.toISOString().split("T")[0],
            type: "food",
            cat: cat.name,
            description: `Reposição de ração (${formData.foodConfig.brand})`,
          });
          currentDate.setDate(currentDate.getDate() + foodFrequency);
        }
      }
    }
  
    if (formData.litterConfig) {
      const litterFrequency = getLitterFrequency(formData.litterConfig.type_of_litter);
      const currentDate = new Date();
      while (currentDate <= endDate) {
        generatedEvents.push({
          date: currentDate.toISOString().split("T")[0],
          type: "litter",
          cat: "",
          description: `Troca completa da areia (${formData.litterConfig.type_of_litter})`,
        });
        currentDate.setDate(currentDate.getDate() + litterFrequency);
      }
    }
  
    if (formData.medicationConfig && formData.medicationConfig.med_name) {
      for (const cat of formData.cats) {
        const medicationFrequency = Number(formData.medicationConfig.frequency_days);
        if (isNaN(medicationFrequency) || medicationFrequency <= 0) continue;
  
        const currentDate = new Date();
        const medicationEndDate = new Date(currentDate);
        medicationEndDate.setDate(medicationEndDate.getDate() + 30);
  
        while (currentDate <= medicationEndDate && currentDate <= endDate) {
          generatedEvents.push({
            date: currentDate.toISOString().split("T")[0],
            type: "medication",
            cat: cat.name,
            description: `Tomar ${formData.medicationConfig.med_name} (${formData.medicationConfig.dosage})`,
          });
          currentDate.setDate(currentDate.getDate() + medicationFrequency);
        }
      }
    }
  
    if (formData.vaccinationConfig && formData.vaccinationConfig.vaccine_name) {
      for (const cat of formData.cats) {
        const currentDate = new Date(formData.vaccinationConfig.date_administered);
        while (currentDate <= endDate) {
          generatedEvents.push({
            date: currentDate.toISOString().split("T")[0],
            type: "vaccine",
            cat: cat.name,
            description: `Vacinação (${formData.vaccinationConfig.vaccine_name})`,
          });
          currentDate.setFullYear(currentDate.getFullYear() + 1);
        }
      }
    }
  
    return generatedEvents;
  }
  
  // funções auxiliares
  function getFoodFrequency(type_of_food: string): number {
    switch (type_of_food) {
      case "seca":
      case "umida":
        return 30;
      case "seca+umida":
        return 20;
      case "natural":
        return 20;
      default:
        return 30;
    }
  }
  
  function getLitterFrequency(type_of_litter: string): number {
    switch (type_of_litter) {
      case "sílica":
        return 20;
      case "biodegradável":
        return 15;
      case "comum":
        return 7;
      default:
        return 20;
    }
  }
  
  // interfaces
  interface Event {
    date: string;
    type: string;
    cat: string;
    description: string;
  }
  
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
    };
  }
 