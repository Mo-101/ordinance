import { updateERHKitImageMapping } from "./erh-kit-mapping"

// Map of item names/categories to real images
export const realItemImages: Record<string, string> = updateERHKitImageMapping({
  // Category-specific images
  "Biomedical Equipment": "/images/real/chemistry-piccolo-analyzer.png",
  "Cold Chain Equipment": "/images/real/medical-refrigerator.webp",
  "Lab & Diagnostics": "/images/real/lab-diagnostics.webp",
  PPE: "/images/real/ppe-tyvek-coverall.png",
  "Biomedical Consumables": "/images/real/biomedical-consumables-supplies.png",
  "Field Support Material": "/images/real/field-support-cot.png",
  Pharmaceuticals: "/images/real/ors-sachets.webp",
  "Emergency Health Kits": "/images/real/trauma-first-aid-kit.png",

  // New specific equipment images with correct categories
  "Boso Medicus Uno":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png",
  "Blood Pressure Monitor":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png",
  Sphygmomanometer:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png",
  "Digital Blood Pressure Monitor":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png",

  // TESK 2019 Emergency Health Kit
  "TESK 2019 Module 1B11":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png",
  "TESK 2019 Module 1B":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png",
  "Set, Renewables, Surgical Miscellaneous Material":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png",
  "Surgical Miscellaneous Material":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png",
  "TESK Surgical Supplies":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png",

  // Halyard N95 Respirator Masks - PPE
  "Halyard Fluidshield":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMt_3.png-4el275JIo6UbRLRz517YKQTWYKPv1F.jpeg",
  "N95 Respirator Mask":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMt_3.png-4el275JIo6UbRLRz517YKQTWYKPv1F.jpeg",
  "Fluidshield N95":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMt_3.png-4el275JIo6UbRLRz517YKQTWYKPv1F.jpeg",
  "Respirator Mask (O&M Halyard - Fluidshield 62126)":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMt_3.png-4el275JIo6UbRLRz517YKQTWYKPv1F.jpeg",

  // Patient Liner for Tent - Field Support Material
  "Patient Liner":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg",
  "Tent Liner":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg",
  "Patient Liner-For High Performance Tent 24m":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg",
  "High Performance Tent Liner":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg",
  "Medical Tent Liner":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg",

  // WHO Cholera Kit - Emergency Health Kits
  "Kit Cholera Central Module Logistic":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_2.JPG-Yp0iNIBZIttcQuuM0Sd3gshxfrcrOD.jpeg",
  "Cholera Kit Logistic":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_2.JPG-Yp0iNIBZIttcQuuM0Sd3gshxfrcrOD.jpeg",
  "WHO Cholera Kit":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_2.JPG-Yp0iNIBZIttcQuuM0Sd3gshxfrcrOD.jpeg",
  "Kit Cholera Central":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_one.png-fce5i7maYoYdKspWJQnyS3mLcDNicg.jpeg",
  "Cholera Emergency Kit":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_one.png-fce5i7maYoYdKspWJQnyS3mLcDNicg.jpeg",
  "WHO Emergency Cholera Supplies":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_one.png-fce5i7maYoYdKspWJQnyS3mLcDNicg.jpeg",

  // Vehicles - specific models
  "Toyota Hilux 4x4": "/images/real/toyota-hilux.png",
  "Mobile Medical Unit": "/images/real/medical-ambulance.png",
  "Toyota Hiace Ambulance": "/images/real/medical-ambulance.png",
  "Supply Transport Truck": "/images/real/medical-ambulance.png",

  // Generic vehicle types
  "Land Cruiser": "/images/real/land-cruiser.png",
  "Toyota Land Cruiser": "/images/real/land-cruiser.png",

  // Cold Chain Equipment - specific items
  "Freezer Aucma": "/images/real/freezer-aucma.png",
  "Freezer Aucma Dw-86L348": "/images/real/freezer-aucma.png",
  "Freezer, Ult (Aucma Dw-86L348)": "/images/real/freezer-aucma.png",
  "Freezer, Ult (Aucma Dw-86W300)": "/images/real/cold-chain-freezer.png",
  "Freezer, Lt (Aucma Dw-25W300)": "/images/real/cold-chain-freezer.png",
  "Cold Box Aucma Arktek-Ybc-5E": "/images/real/cold-chain-arktek.webp",
  "Cold Box (Aucma Arktek-Ybc-5E)": "/images/real/cold-chain-arktek.webp",
  "Vaccine Refrigerator": "/images/real/medical-refrigerator.webp",
  "Cold Box": "/images/real/cold-box.png",
  Freezer: "/images/real/medical-refrigerator.webp",
  "Portable Refrigerator": "/images/real/portable-refrigerator.png",
  "Medical Refrigerator": "/images/real/portable-refrigerator.png",

  // Biomedical Equipment - specific items
  "Portable X-Ray System": "/images/real/biomedical-equipment.jpeg",
  "Portable X-Ray": "/images/real/portable-xray.png",
  "X-Ray": "/images/real/portable-xray.png",
  Ultrasound: "/images/real/portable-ultrasound.png",
  "ECG Machine": "/images/real/biomedical-operating-room.png",
  "Chemistry Analyzer": "/images/real/chemistry-piccolo-analyzer.png",
  "Chemistry Analyzer Piccolo Xpress": "/images/real/chemistry-piccolo-analyzer.png",
  "Patient Monitor": "/images/real/biomedical-operating-room.png",
  "Vital Signs Monitor": "/images/real/biomedical-operating-room.png",
  Defibrillator: "/images/real/biomedical-operating-room.png",
  "Surgical Equipment": "/images/real/biomedical-operating-room.png",
  "Operating Room Equipment": "/images/real/biomedical-operating-room.png",

  // Oxygen Equipment
  "Oxygen Concentrator": "/images/real/oxygen-concentrator.png",
  "Oxygen Concentrator (Canta V8-Wn-Ns)": "/images/real/oxygen-concentrator.png",
  "Oxygen Concentrator (Jay 10)": "/images/real/oxygen-concentrator.png",
  "Oxygen Cylinder": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder (Lta-O2 + Humid_No.13)": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder (Lta-O2 + Humid_No.16)": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder (Lta-O2 + Humid_No.2)": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder (Lta-O2 + Humid_No.6)": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder 2.3L": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder 47.2L": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder 9.4L": "/images/real/oxygen-cylinders.png",
  "Oxygen Cylinder, 4.7 L": "/images/real/oxygen-cylinders.png",

  // Biomedical Consumables - specific items
  "High Flow Nasal Cannula": "/images/real/nasal-higflow.png",
  "Oxygen Tubing": "/images/real/nasal-higflow.png",
  "Nasal Cannula": "/images/real/nasal-higflow.png",
  "Thermal Paper": "/images/real/medical-tape.png",
  "Thermal Paper, Roll": "/images/real/medical-tape.png",
  Filter: "/images/real/biomedical-consumables-supplies.png",
  "Medical Supplies": "/images/real/biomedical-consumables-supplies.png",
  Syringes: "/images/real/biomedical-consumables-supplies.png",
  Medication: "/images/real/biomedical-consumables-supplies.png",

  // Field Support Material - specific items
  "Field Hospital Generator": "/images/real/field-support-cot.png",
  Generator: "/images/real/field-support-material.jpeg",
  Tent: "/images/real/emergency-tent.png",
  "Field Cot": "/images/real/field-support-cot.png",
  "Medical Cot": "/images/real/field-support-cot.png",
  Stretcher: "/images/real/field-support-cot.png",

  // Lab & Diagnostics - specific items
  "Chemistry Analyzer Piccolo Xpress": "/images/real/chemistry-piccolo-analyzer.png",
  "Lab Kit": "/images/real/lab-diagnostics.webp",
  "Diagnostic Equipment": "/images/real/lab-diagnostics.webp",
  "Cholera Test Kit": "/images/real/cholera-test-kit.jpeg",
  "Diagnostic Test": "/images/real/cholera-test-kit.jpeg",

  // PPE - specific items
  "Examination Gloves": "/images/real/ppe-suit.webp",
  "Surgical Gloves": "/images/real/ppe-suit.webp",
  "Heavy Duty Gloves": "/images/real/ppe-suit.webp",
  "Protective Goggles": "/images/real/ppe-suit.webp",
  "Face Shield": "/images/real/face-shield-yellow.png",
  "Medical Mask": "/images/real/ppe-suit.webp",
  "Respirator Mask": "/images/real/ppe-suit.webp",
  "N95 Respirator Mask": "/images/real/ppe-suit.webp",
  "Protective Gown": "/images/real/ppe-suit.webp",
  "Protective Coverall": "/images/real/ppe-tyvek-coverall.png",
  "Protective Apron": "/images/real/ppe-suit.webp",
  "Rubber Boots": "/images/real/ppe-suit.webp",
  "Surgical Cap": "/images/real/ppe-suit.webp",
  "PPE Kit Complete": "/images/real/ppe-kit.png",

  // Emergency Health Kits - updated with trauma kit image
  "Cholera Kit": "/images/real/cholera-kit.png",
  "Kit Cholera Central": "/images/real/ida-boxes.jpeg",
  "Kit Cholera Community": "/images/real/ida-boxes.jpeg",
  "Kit Cholera Hardware": "/images/real/ida-boxes.jpeg",
  IEHK: "/images/real/iehk-kit-illustration.png",
  "IEHK 2017": "/images/real/iehk-kit-illustration.png",
  "IEHK 2017, Basic": "/images/real/iehk-kit-illustration.png",
  "IEHK 2017, Supplementary": "/images/real/iehk-kit-illustration.png",
  "IEHK 2021": "/images/real/iehk-kit-illustration.png",
  "IEHK 2021, Supplementary": "/images/real/iehk-kit-illustration.png",
  "Emergency Health Kit": "/images/real/trauma-first-aid-kit.png",
  "Interagency Emergency Health Kit": "/images/real/iehk-kit-illustration.png",
  "Trauma Kit": "/images/real/trauma-kit-red.webp",
  "Trauma First Aid Kit": "/images/real/trauma-kit-red.webp",
  "First Aid Kit": "/images/real/trauma-kit-red.webp",
  "Isolation Transport Unit": "/images/real/isolation-transport-unit.png",
  "Isolation and Transport Patient": "/images/real/isolation-transport-unit.png",

  // Pharmaceuticals
  "Lactated Ringer's Solution": "/images/real/lactated-ringers-iv.jpeg",
  "Lactated Ringer's": "/images/real/lactated-ringers-iv.jpeg",
  "Ringer's Lactate": "/images/real/lactated-ringers-iv.jpeg",
  "IV Solution": "/images/real/lactated-ringers-bag.jpeg",
  "IV Fluid": "/images/real/lactated-ringers-bag.jpeg",
  ORS: "/images/real/ors-box.webp",
  "Oral Rehydration Salts": "/images/real/ors-box.webp",
  "Rehydration Solution": "/images/real/ors-box.webp",
  Chlorine: "/images/real/diagnostic-test-kit.webp",
  "Chlorine HTH": "/images/real/diagnostic-test-kit.webp",
  "Water Purification": "/images/real/diagnostic-test-kit.webp",

  // Generic category images for fallbacks
  "Emergency Health Kits": "/images/real/trauma-first-aid-kit.png",
  Vehicles: "/images/real/toyota-hilux-white.png",

  // For Lactated Ringer's Solution
  "Ringer Lactate": "/images/real/lactated-ringers-iv.jpeg",
  "RINGER lactate": "/images/real/lactated-ringers-iv.jpeg",

  // For ORS
  "Oral Rehydration Salts (Ors)": "/images/real/ors-box.webp",
  "Oral Rehydration Salts": "/images/real/ors-box.webp",
  ORS: "/images/real/ors-box.webp",

  // For Chlorine
  "CHLORINE HTH": "/images/real/diagnostic-test-kit.webp",
  "Chlorine HTH": "/images/real/diagnostic-test-kit.webp",

  // For Portable Medical Refrigerator
  "Portable Medical Refrigerator": "/images/real/medical-coolers.png",
  "Medical Refrigerator": "/images/real/medical-coolers.png",

  // Water Testing & Lab Equipment
  "AquaPro Water Testing Kit": "/images/real/aquapro-water-testing-kit.png",
  "Water Testing Kit": "/images/real/aquapro-water-testing-kit.png",
  "Milwaukee PRO Portable Meters": "/images/real/aquapro-water-testing-kit.png",
  "Water Quality Testing": "/images/real/aquapro-water-testing-kit.png",
  "Portable Water Testing": "/images/real/aquapro-water-testing-kit.png",

  // Cold Chain - Deep Freezers
  "Haier Deep Freezer": "/images/real/haier-deep-freezer.png",
  "Deep Freezer": "/images/real/haier-deep-freezer.png",
  "Medical Deep Freezer": "/images/real/haier-deep-freezer.png",
  "Laboratory Freezer": "/images/real/haier-deep-freezer.png",
  "Ultra Low Temperature Freezer": "/images/real/haier-deep-freezer.png",

  // Pharmaceuticals - Antibiotics
  Amoxicillin: "/images/real/amoxicillin-tablets.png",
  "Amoxicillin Dispersible Tablets": "/images/real/amoxicillin-tablets.png",
  "Amoxicillin 250mg": "/images/real/amoxicillin-tablets.png",
  "Antibiotic Tablets": "/images/real/amoxicillin-tablets.png",
  "Dispersible Tablets": "/images/real/amoxicillin-tablets.png",

  // Emergency Health Kits - WHO Trauma Kit
  "WHO Trauma Kit (EAR 2020)": "/images/real/who-trauma-kit-family-bag.png",
  "Trauma IEAR Personal Family Bag": "/images/real/who-trauma-kit-family-bag.png",
  "WHO Emergency Kit": "/images/real/who-trauma-kit-family-bag.png",
  "Personal Family Emergency Bag": "/images/real/who-trauma-kit-family-bag.png",
  "Emergency Response Kit": "/images/real/who-trauma-kit-family-bag.png",

  // Medical Supplies - IDA Foundation
  "IDA Medical Supplies": "/images/real/ida-medical-supplies-open.png",
  "Medical Supply Kit": "/images/real/ida-medical-supplies-open.png",
  "IDA Foundation Kit": "/images/real/ida-medical-supplies-open.png",
  "Medical Consumables Kit": "/images/real/ida-medical-supplies-open.png",
  "Syringe Kit": "/images/real/ida-medical-supplies-open.png",

  // Storage & Logistics - IDA Boxes
  "IDA Foundation Boxes": "/images/real/ida-foundation-boxes.png",
  "Medical Supply Boxes": "/images/real/ida-foundation-boxes.png",
  "Pharmaceutical Storage": "/images/real/ida-foundation-boxes.png",
  "Medical Logistics Boxes": "/images/real/ida-foundation-boxes.png",

  // Cold Chain - Thermal Control
  "Thermal Control Unit TC9": "/images/real/thermal-control-unit-tc9.png",
  "AIRSEA Thermal Control": "/images/real/thermal-control-unit-tc9.png",
  "Temperature Control Unit": "/images/real/thermal-control-unit-tc9.png",
  "Cold Chain Thermal Control": "/images/real/thermal-control-unit-tc9.png",
  "Medical Temperature Control": "/images/real/thermal-control-unit-tc9.png",

  // Emergency Health Kits - WHO First Aid
  "WHO First Aid Kit": "/images/real/who-first-aid-kit-blue.png",
  "First Aid Kit (WHO)": "/images/real/who-first-aid-kit-blue.png",
  "WHO Emergency First Aid": "/images/real/who-first-aid-kit-blue.png",
  "Blue First Aid Kit": "/images/real/who-first-aid-kit-blue.png",

  // PPE - Isolation Gowns
  "Isolation Gowns": "/images/real/isolation-gowns-medline.png",
  "Medline Isolation Gowns": "/images/real/isolation-gowns-medline.png",
  "Protective Isolation Gowns": "/images/real/isolation-gowns-medline.png",
  "Medical Isolation Gowns": "/images/real/isolation-gowns-medline.png",
  "PPE Isolation Gowns": "/images/real/isolation-gowns-medline.png",

  // PPE - Nitrile Gloves
  "Nitril X-Long Gloves": "/images/real/nitril-gloves-meditrade.png",
  "Meditrade Gloves": "/images/real/nitril-gloves-meditrade.png",
  "Nitrile Gloves": "/images/real/nitril-gloves-meditrade.png",
  "Medical Nitrile Gloves": "/images/real/nitril-gloves-meditrade.png",
  "Extended Cuff Gloves": "/images/real/nitril-gloves-meditrade.png",
  "Large Nitrile Gloves": "/images/real/nitril-gloves-meditrade.png",
})

export const categoryImages = {
  Vehicles: "/images/real/toyota-hilux.png",
  "Biomedical Equipment":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png", // Updated to use blood pressure monitor
  "Cold Chain Equipment": "/images/real/haier-deep-freezer.png", // Updated to use Haier freezer
  "Emergency Health Kits":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png", // Updated to use TESK kit
  "Biomedical Consumables": "/images/real/biomedical-consumables-supplies.png",
  "Field Support Material":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg", // Updated to use tent liner
  PPE: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMt_3.png-4el275JIo6UbRLRz517YKQTWYKPv1F.jpeg", // Updated to use N95 mask box
  "Wash & IPC Materials": "/wash-ipc-materials.png",
  Nutrition: "/nutrition-equipment.png",
  Pharmaceuticals: "/images/real/amoxicillin-tablets.png", // Updated to use antibiotic tablets
  "Lab & Diagnostics": "/images/real/aquapro-water-testing-kit.png", // Updated to use water testing kit
  "IT & Communication Equipment": "/it-communication-equipment.png",
  "Visibility Materials": "/visibility-materials.png",
  Wellbeing: "/images/real/trauma-first-aid-kit.png",
}

export const itemTypeImages = {
  // Updated with new specific equipment
  "Boso Medicus Uno":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png",
  "Blood Pressure Monitor":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png",
  "TESK 2019 Module 1B11":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png",
  "Halyard Fluidshield":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMt_3.png-4el275JIo6UbRLRz517YKQTWYKPv1F.jpeg",
  "Patient Liner":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg",
  "WHO Cholera Kit":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_2.JPG-Yp0iNIBZIttcQuuM0Sd3gshxfrcrOD.jpeg",
  "Kit Cholera Central":
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_one.png-fce5i7maYoYdKspWJQnyS3mLcDNicg.jpeg",

  "High Flow Nasal Cannula": "/images/real/nasal-higflow.png",
  "Nasal Oxygen Cannula": "/images/real/nasal-higflow.png",
  "Oxygen Tubing": "/images/real/nasal-higflow.png",
  "Cholera Bed": "/images/real/field-support-cot.png",
  "Emergency Stretcher": "/images/real/field-support-cot.png",
  "Medical Supplies Kit": "/images/real/biomedical-consumables-supplies.png",
  "Oxygen Concentrator": "/images/real/oxygen-concentrator.png",
  "Oxygen Cylinder": "/images/real/oxygen-cylinders.png",
  "Cold Box Aucma": "/images/real/cold-chain-arktek.webp",
  "Freezer Aucma": "/images/real/freezer-aucma.png",
  "Thermal Paper": "/images/real/medical-tape.png",
  "Patient Monitor": "/images/real/biomedical-operating-room.png",
  "Trauma Kit": "/images/real/trauma-first-aid-kit.png",
  "Lactated Ringer's": "/images/real/lactated-ringers.jpeg",
  ORS: "/images/real/ors-sachets.webp",
  "Cholera Test": "/images/real/cholera-test-kit.jpeg",
  "Portable Refrigerator": "/images/real/portable-refrigerator.png",
  "Examination Gloves": "/images/real/ppe-suit.webp",
  "Surgical Gloves": "/images/real/ppe-suit.webp",
  "Face Shield": "/images/real/face-shield-yellow.png",
  "Protective Goggles": "/images/real/ppe-suit.webp",
  "Medical Mask": "/images/real/ppe-suit.webp",
  "Respirator Mask": "/images/real/ppe-suit.webp",
  "Protective Gown": "/images/real/ppe-suit.webp",
  "Protective Coverall": "/images/real/ppe-tyvek-coverall.png",
  "Emergency Kit": "/images/real/trauma-first-aid-kit.png",
  "First Aid Kit": "/images/real/trauma-first-aid-kit.png",
  "Operating Room": "/images/real/biomedical-operating-room.png",
  "Surgical Equipment": "/images/real/biomedical-operating-room.png",
  IEHK: "/images/real/iehk-kit-illustration.png",
  "Interagency Emergency Health Kit": "/images/real/iehk-kit-illustration.png",
  "Chemistry Analyzer": "/images/real/chemistry-piccolo-analyzer.png",
  "Chemistry Analyzer Piccolo Xpress": "/images/real/chemistry-piccolo-analyzer.png",
  "Medical Cooler": "/images/real/medical-coolers.png",
  "Portable Medical Refrigerator": "/images/real/medical-coolers.png",
}

/**
 * Get a real image for an item if available
 * @param item The inventory item
 * @returns URL to a real image or null if no match
 */
export function getRealItemImage(item: any): string {
  // First check if we have an exact match for this specific item
  if (item.image && item.image.startsWith("/images/real/")) {
    return item.image
  }

  // Check for exact name matches
  if (item.name && realItemImages[item.name]) {
    return realItemImages[item.name]
  }

  // Special case for new equipment
  if (item.name && item.name.includes("Boso Medicus")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Boso%20Medicus%20Uno-o7zfxHgLvTr7MfEWVDHPUXHSfP4NrJ.png"
  }

  if (item.name && item.name.includes("TESK 2019 Module 1B")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%28TESK%202019%20Module%201B11%29%20Set%2C%20Renewal%2C%20Surgical%20Miscellaneous%20Material-a2ehYFMY4AiovKRM1Y1gz3nNXr57oD.png"
  }

  if (item.name && item.name.includes("Halyard") && item.name.includes("Fluidshield")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMt_3.png-4el275JIo6UbRLRz517YKQTWYKPv1F.jpeg"
  }

  if (item.name && item.name.includes("Patient Liner")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Patient%20Liner-For%20High%20performance%20Tent%2024m%20masterb%20bag%201-1-Patient%20Line.png-xbdsMhFFoOdWcJPFVf9aAYZgRqJUUS.jpeg"
  }

  if (item.name && item.name.includes("Cholera") && item.name.includes("Kit")) {
    return "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMT_2.JPG-Yp0iNIBZIttcQuuM0Sd3gshxfrcrOD.jpeg"
  }

  // Special case for Chemistry Analyzer items
  if (
    (item.name && item.name.includes("Chemistry Analyzer")) ||
    (item.description && item.description.includes("Chemistry Analyzer"))
  ) {
    return "/images/real/chemistry-piccolo-analyzer.png"
  }

  // Special case for IEHK items
  if ((item.name && item.name.includes("IEHK")) || (item.description && item.description.includes("IEHK"))) {
    return "/images/real/iehk-kit-illustration.png"
  }

  // Special case for Trauma Kit items
  if (
    (item.name && item.name.includes("Trauma Kit")) ||
    (item.description && item.description.includes("Trauma Kit"))
  ) {
    return "/images/real/trauma-first-aid-kit.png"
  }

  // Check if we have an image for this item type
  for (const [itemType, imagePath] of Object.entries(itemTypeImages)) {
    if (item.name.includes(itemType) || item.description.includes(itemType)) {
      return imagePath
    }
  }

  // Check for partial name matches
  for (const [key, imageUrl] of Object.entries(realItemImages)) {
    if (item.name && item.name.includes(key)) {
      return imageUrl
    }
  }

  // Check for partial matches in description
  for (const [key, imageUrl] of Object.entries(realItemImages)) {
    if (item.description && item.description.toLowerCase().includes(key.toLowerCase())) {
      return imageUrl
    }
  }

  // Fall back to category image
  if (item.category && categoryImages[item.category]) {
    return categoryImages[item.category]
  }

  // Default fallback
  return item.image || `/svg/fallbacks/${item.category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}.png`
}

/**
 * Get the best image for a category slideshow
 * @param category The category name
 * @param items Array of items in that category
 * @returns URL to the best representative image
 */
export function getCategoryShowcaseImage(category: string, items: any[]): string {
  // If we have a direct category image, use it
  if (categoryImages[category]) {
    return categoryImages[category]
  }

  // Otherwise, find the first item in the category that has a real image
  const categoryItems = items.filter((item) => item.category === category)

  for (const item of categoryItems) {
    const itemImage = getRealItemImage(item)
    if (itemImage && (itemImage.startsWith("/images/real/") || itemImage.startsWith("https://blob.v0.dev/"))) {
      return itemImage
    }
  }

  // Fallback to a placeholder
  return `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(category)}`
}

/**
 * Get a specific image for a category based on priority
 * @param category The category name
 * @returns URL to the category image
 */
export function getCategoryImage(category: string): string {
  if (categoryImages[category]) {
    return categoryImages[category]
  }

  return `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(category)}`
}
