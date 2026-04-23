const http = require('http');

const data = JSON.stringify({
  formData: {
    projectName: "Test AI Project",
    plotArea: "1800",
    buildingType: "residential",
    vastuOrientation: "East",
    location: "Hyderabad",
    floors: "2",
    soilType: "normal",
    seismicZone: "Zone-3",
    securityLevel: "AI Face-ID Access",
    acousticTarget: "Quiet",
    automationLevel: "Smart Basic",
    fireSafetyGrade: "Grade-B NBC",
    hvacType: "Split-AC",
    exteriorCladding: "Texture Paint",
    flooringPreference: "Italian Marble",
    laborContractType: "item_rate_standard",
    roadAccess: "narrow_tractor_access",
    topography: "moderate_slope",
    wastageTolerance: "8",
    laborSkill: "high_shortage",
    curingMethod: "chemical_compounds",
    groundwaterLevel: "high_water_table",
    projectStartDate: "2",
    projectDuration: "14",
    plumbingBrand: "astral_premium",
    woodwork: "teak_wood",
    digitalTwinSync: true,
    localZoningSync: true,
    temporarySetup: true,
    carbonTarget: "Standard Footprint",
    statutoryApproval: "premium_fast_track",
    concreteGrade: "M25",
    steelGrade: "Fe550D",
    foundationDepth: "5-7 ft",
    wallMaterial: "AAC Blocks",
    cementType: "OPC 53 Grade",
    numRooms: "5"
  },
  requirements: {
    hvac: "split-ac",
    smartOptions: ["lighting", "security"],
    solarIntegration: true,
    rainwaterHarvesting: true,
    fireExtinguishing: false,
    backupPower: true
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ml-project-estimation',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      console.log(JSON.stringify(JSON.parse(responseData), null, 2));
    } catch(e) {
      console.log("Error parsing response:", responseData);
    }
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
