import { FeatureCollection } from "geojson";

export const featureCollectionSample: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        color: "grey",
        name: "feature"
      },
      geometry: {
        type: "Point",
        coordinates: [
          8.480442166328432,
          49.59133421571489
        ]
      },
      id: "featureId"
    }
  ]
};
