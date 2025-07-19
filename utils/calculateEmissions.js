function calculateEmissions(data) {
  const MAX_FOOD_KG = 500; // monthly cap
  const MAX_TRANSPORT_KM = 10000;
  const MAX_ELECTRICITY_KWH = 2000;
  const MAX_WASTE_KG = 1000;

  let capped = false;

  // --- FOOD ---
  let foodEmission = 0;
  const foodWithEmission = data.food ? (() => {
    let amountKg = data.food.amountKg || 0;
    if (amountKg > MAX_FOOD_KG) {
      capped = true;
      amountKg = MAX_FOOD_KG;
    }
    const factorMap = {
      "Animal based": 6.0,
      "Plant based": 1.5,
      "Both": 3.8
    };
    const factor = factorMap[data.food.type] || 3.0;
    const emissionKg = amountKg * factor;
    foodEmission = emissionKg;
    return { ...data.food, amountKg, emissionKg };
  })() : null;

  // --- TRANSPORT ---
  let transportTotal = 0;
  const transportWithEmissions = (data.transport || []).map(item => {
    let distanceKm = item.distanceKm || 0;
    if (distanceKm > MAX_TRANSPORT_KM) {
      capped = true;
      distanceKm = MAX_TRANSPORT_KM;
    }
    const factor = {
      Car: 0.192,
      Bike: 0.016,
      Bus: 0.089,
      Metro: 0.041,
      Walking: 0.00,
      Train: 0.049,
      Flights: distanceKm > 1500 ? 0.150 : 0.254
    }[item.mode] || 0;

    const emissionKg = factor * distanceKm;
    transportTotal += emissionKg;
    return { ...item, distanceKm, emissionKg };
  });

  // --- ELECTRICITY ---
  let electricityTotal = 0;
  const electricityWithEmissions = (data.electricity || []).map(item => {
    let consumptionKwh = item.consumptionKwh || 0;
    if (consumptionKwh > MAX_ELECTRICITY_KWH) {
      capped = true;
      consumptionKwh = MAX_ELECTRICITY_KWH;
    }
    const factor = {
      Coal: 0.94,
      Solar: 0.05,
      Wind: 0.01,
      Hydro: 0.02,
      Mixed: 0.45
    }[item.source] || 0.45;

    const emissionKg = factor * consumptionKwh;
    electricityTotal += emissionKg;
    return { ...item, consumptionKwh, emissionKg };
  });

  // --- WASTE ---
  let wasteTotal = 0;
  const wasteWithEmissions = (data.waste || []).map(item => {
    let plasticKg = item.plasticKg || 0;
    let paperKg = item.paperKg || 0;
    let foodWasteKg = item.foodWasteKg || 0;

    if (plasticKg > MAX_WASTE_KG || paperKg > MAX_WASTE_KG || foodWasteKg > MAX_WASTE_KG) {
      capped = true;
      plasticKg = Math.min(plasticKg, MAX_WASTE_KG);
      paperKg = Math.min(paperKg, MAX_WASTE_KG);
      foodWasteKg = Math.min(foodWasteKg, MAX_WASTE_KG);
    }

    const emissionKg =
      plasticKg * 5.8 +
      paperKg * 1.3 +
      foodWasteKg * 2.5;

    wasteTotal += emissionKg;
    return { ...item, plasticKg, paperKg, foodWasteKg, emissionKg };
  });

  // --- TOTAL ---
  const totalEmissionKg = parseFloat(
    (foodEmission + transportTotal + electricityTotal + wasteTotal).toFixed(2)
  );

  // --- Suggestions ---
  let suggestions = capped
    ? "⚠️ Some unusually high inputs were capped to keep values realistic for a month.\n"
    : "";

  const categories = [
    { name: "Food", value: foodEmission, emoji: "🥗" },
    { name: "Transport", value: transportTotal, emoji: "🚗" },
    { name: "Electricity", value: electricityTotal, emoji: "⚡" },
    { name: "Waste", value: wasteTotal, emoji: "🗑️" }
  ].sort((a, b) => b.value - a.value);

  if (totalEmissionKg <= 300) {
    suggestions += "🌱 **Excellent!** Your monthly footprint is low. Keep up your eco-friendly habits — consider tree-planting or helping others reduce their footprint!";
  } else {
    suggestions += "Here’s where you can make the biggest impact:\n";
    categories.slice(0, 2).forEach(c => {
      if (c.name === "Food")
        suggestions += `${c.emoji} Reduce meat & dairy, and include more plant-based meals.\n`;
      if (c.name === "Transport")
        suggestions += `${c.emoji} Prefer public transport, carpool, or biking for short trips.\n`;
      if (c.name === "Electricity")
        suggestions += `${c.emoji} Shift to renewables and avoid unnecessary power consumption.\n`;
      if (c.name === "Waste")
        suggestions += `${c.emoji} Recycle plastics, compost food, and reduce paper usage.\n`;
    });
    suggestions += "💡 Small consistent efforts lead to a significant monthly reduction!";
  }

  return {
    totalEmissionKg,
    suggestions,
    capped,
    foodWithEmission,
    transportWithEmissions,
    electricityWithEmissions,
    wasteWithEmissions
  };
}

module.exports = calculateEmissions;
