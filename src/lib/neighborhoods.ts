// SF neighborhood boundaries for map rendering
// Polygons are simplified but shaped to tile together without gaps

export interface Neighborhood {
  name: string;
  slug: string;
  lat: number;
  lng: number;
  elevation: number; // avg meters
  polygon: [number, number][];
}

export const neighborhoods: Neighborhood[] = [
  // === NORTHEAST (sunny, east of ridge) ===
  {
    name: "North Beach", slug: "north-beach",
    lat: 37.806, lng: -122.410, elevation: 10,
    polygon: [[37.812,-122.420],[37.812,-122.400],[37.800,-122.400],[37.800,-122.413],[37.803,-122.420]],
  },
  {
    name: "Russian Hill", slug: "russian-hill",
    lat: 37.800, lng: -122.420, elevation: 65,
    polygon: [[37.803,-122.420],[37.800,-122.413],[37.794,-122.413],[37.794,-122.427],[37.803,-122.427]],
  },
  {
    name: "Nob Hill", slug: "nob-hill",
    lat: 37.793, lng: -122.416, elevation: 100,
    polygon: [[37.797,-122.420],[37.797,-122.410],[37.789,-122.410],[37.789,-122.420]],
  },
  {
    name: "Chinatown", slug: "chinatown",
    lat: 37.795, lng: -122.407, elevation: 30,
    polygon: [[37.800,-122.413],[37.800,-122.400],[37.791,-122.400],[37.791,-122.410],[37.797,-122.410],[37.797,-122.413]],
  },
  {
    name: "Financial District", slug: "financial-district",
    lat: 37.794, lng: -122.398, elevation: 5,
    polygon: [[37.800,-122.400],[37.800,-122.390],[37.788,-122.390],[37.788,-122.400]],
  },
  {
    name: "SOMA", slug: "soma",
    lat: 37.779, lng: -122.395, elevation: 5,
    polygon: [[37.788,-122.410],[37.788,-122.390],[37.773,-122.385],[37.773,-122.410]],
  },
  {
    name: "Tenderloin", slug: "tenderloin",
    lat: 37.784, lng: -122.413, elevation: 15,
    polygon: [[37.789,-122.420],[37.789,-122.410],[37.780,-122.410],[37.780,-122.420]],
  },

  // === MARINA / PACIFIC HEIGHTS (fog corridor) ===
  {
    name: "Marina", slug: "marina",
    lat: 37.801, lng: -122.437, elevation: 5,
    polygon: [[37.808,-122.452],[37.808,-122.427],[37.798,-122.427],[37.798,-122.452]],
  },
  {
    name: "Pacific Heights", slug: "pacific-heights",
    lat: 37.793, lng: -122.435, elevation: 60,
    polygon: [[37.798,-122.452],[37.798,-122.427],[37.789,-122.427],[37.789,-122.445],[37.792,-122.452]],
  },
  {
    name: "Western Addition", slug: "western-addition",
    lat: 37.781, lng: -122.432, elevation: 30,
    polygon: [[37.789,-122.445],[37.789,-122.420],[37.775,-122.420],[37.775,-122.445]],
  },

  // === PRESIDIO / RICHMOND (west, foggy) ===
  {
    name: "Presidio", slug: "presidio",
    lat: 37.800, lng: -122.465, elevation: 30,
    polygon: [[37.808,-122.484],[37.808,-122.452],[37.792,-122.452],[37.788,-122.460],[37.790,-122.484]],
  },
  {
    name: "Inner Richmond", slug: "inner-richmond",
    lat: 37.779, lng: -122.464, elevation: 40,
    polygon: [[37.790,-122.484],[37.788,-122.460],[37.785,-122.455],[37.775,-122.455],[37.775,-122.484]],
  },
  {
    name: "Outer Richmond", slug: "outer-richmond",
    lat: 37.779, lng: -122.497, elevation: 20,
    polygon: [[37.790,-122.512],[37.790,-122.484],[37.775,-122.484],[37.775,-122.512]],
  },

  // === CENTRAL (ridge area) ===
  {
    name: "Haight-Ashbury", slug: "haight-ashbury",
    lat: 37.769, lng: -122.448, elevation: 60,
    polygon: [[37.775,-122.455],[37.775,-122.440],[37.764,-122.440],[37.764,-122.458],[37.770,-122.458]],
  },
  {
    name: "Castro", slug: "castro",
    lat: 37.761, lng: -122.435, elevation: 60,
    polygon: [[37.768,-122.445],[37.768,-122.428],[37.757,-122.428],[37.757,-122.445]],
  },
  {
    name: "Twin Peaks", slug: "twin-peaks",
    lat: 37.752, lng: -122.448, elevation: 280,
    polygon: [[37.764,-122.458],[37.764,-122.445],[37.757,-122.445],[37.745,-122.448],[37.745,-122.462],[37.757,-122.462]],
  },

  // === SUNSET (west, foggy) ===
  {
    name: "Inner Sunset", slug: "inner-sunset",
    lat: 37.760, lng: -122.468, elevation: 40,
    polygon: [[37.770,-122.484],[37.770,-122.458],[37.757,-122.462],[37.750,-122.462],[37.750,-122.484]],
  },
  {
    name: "Outer Sunset", slug: "outer-sunset",
    lat: 37.755, lng: -122.497, elevation: 15,
    polygon: [[37.762,-122.512],[37.762,-122.484],[37.750,-122.484],[37.750,-122.512]],
  },
  {
    name: "Parkside", slug: "parkside",
    lat: 37.744, lng: -122.487, elevation: 10,
    polygon: [[37.750,-122.512],[37.750,-122.462],[37.738,-122.462],[37.738,-122.512]],
  },

  // === MISSION / NOE VALLEY (east of ridge, sunny) ===
  {
    name: "Mission", slug: "mission",
    lat: 37.760, lng: -122.415, elevation: 20,
    polygon: [[37.773,-122.428],[37.773,-122.410],[37.749,-122.410],[37.749,-122.428]],
  },
  {
    name: "Noe Valley", slug: "noe-valley",
    lat: 37.750, lng: -122.434, elevation: 70,
    polygon: [[37.757,-122.445],[37.757,-122.428],[37.745,-122.428],[37.745,-122.448]],
  },
  {
    name: "Potrero Hill", slug: "potrero-hill",
    lat: 37.761, lng: -122.400, elevation: 90,
    polygon: [[37.766,-122.410],[37.766,-122.393],[37.755,-122.393],[37.755,-122.410]],
  },
  {
    name: "Dogpatch", slug: "dogpatch",
    lat: 37.759, lng: -122.388, elevation: 5,
    polygon: [[37.766,-122.393],[37.766,-122.382],[37.755,-122.382],[37.755,-122.393]],
  },

  // === SOUTH (mixed) ===
  {
    name: "Bernal Heights", slug: "bernal-heights",
    lat: 37.739, lng: -122.416, elevation: 100,
    polygon: [[37.749,-122.428],[37.749,-122.407],[37.733,-122.407],[37.733,-122.428]],
  },
  {
    name: "Glen Park", slug: "glen-park",
    lat: 37.734, lng: -122.433, elevation: 60,
    polygon: [[37.745,-122.448],[37.745,-122.428],[37.728,-122.428],[37.728,-122.448]],
  },
  {
    name: "Excelsior", slug: "excelsior",
    lat: 37.726, lng: -122.425, elevation: 40,
    polygon: [[37.733,-122.435],[37.733,-122.407],[37.718,-122.407],[37.718,-122.435]],
  },
  {
    name: "Bayview", slug: "bayview",
    lat: 37.734, lng: -122.390, elevation: 15,
    polygon: [[37.749,-122.407],[37.749,-122.382],[37.718,-122.382],[37.718,-122.407]],
  },
  {
    name: "Visitacion Valley", slug: "visitacion-valley",
    lat: 37.718, lng: -122.413, elevation: 30,
    polygon: [[37.718,-122.435],[37.718,-122.400],[37.708,-122.400],[37.708,-122.435]],
  },

  // === MISC ===
  {
    name: "Hunters Point", slug: "hunters-point",
    lat: 37.725, lng: -122.375, elevation: 10,
    polygon: [[37.740,-122.382],[37.740,-122.365],[37.718,-122.365],[37.718,-122.382]],
  },
  {
    name: "Treasure Island", slug: "treasure-island",
    lat: 37.823, lng: -122.370, elevation: 5,
    polygon: [[37.830,-122.378],[37.830,-122.362],[37.816,-122.362],[37.816,-122.378]],
  },
];
