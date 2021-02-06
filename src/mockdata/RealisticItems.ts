import { ProductItem } from "../app/3D/models/ProductItem/ProductItem";
import { getIkeaChearModel, getIkeaTableModel, getWayfairChairModel, getWayfairTableModel } from "./Models";
import { ProductConfigurationEvent } from "../app/product-configurator-events";

export function createWayfairTable(id: number): ProductItem {
  return {
    id,
    name: "table1",
    thumbnail: "assets/models/pbr/thumbnail_wayfair_table.png",
    models: [ getWayfairTableModel() ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "A table.",
    subItems: [],

    activeEvents: [],
  };
}

export function createWayfairChair(id: number): ProductItem {
  return {
    id,
    name: "chair",
    thumbnail: "assets/models/pbr/thumbnail_wayfair_chair.png",
    models: [ getWayfairChairModel() ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "A hard chair.",
    subItems: [],

    activeEvents: [],
  };
}

// That typo... well it's fun to keep using it for this little example.
export function createIkeaChear(id: number): ProductItem {
  const ikeaChearProduct: ProductItem = {
    id,
    name: "chear",
    thumbnail: "assets/models/pbr/thumbnail_ikea_chair.png",
    models: [ getIkeaChearModel() ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "A soft chair.",
    subItems: [],
    selectedSubItem: null,

    activeEvents: [],
  };

  const chearSubItems = ikeaChearProduct.subItems;

  chearSubItems.push({
    id: chearSubItems.length,
    // TODO: Change this into using a thumbnail.
    // 1024x1024 image scaled to ~32x32px :D - them loading times too!
    image: "assets/models/pbr/chair_mat_baseColor.png",
    eventType: ProductConfigurationEvent.Material_TextureSwap,
    tooltip: "White chair",
    data: {
      productItem: ikeaChearProduct,
      textureSlot: "map",
      textureUrl: "assets/models/pbr/chair_mat_baseColor.png",
    }
  });
  chearSubItems.push({
    id: chearSubItems.length,
    // TODO: Change this into using a thumbnail.
    // 1024x1024 image scaled to ~32x32px :D - them loading times too!
    image: "assets/models/pbr/chair_mat_baseColor_alt.png",
    eventType: ProductConfigurationEvent.Material_TextureSwap,
    tooltip: "Blue chair",
    data: {
      productItem: ikeaChearProduct,
      textureSlot: "map",
      textureUrl: "assets/models/pbr/chair_mat_baseColor_alt.png",
    }
  });
  ikeaChearProduct.selectedSubItem = chearSubItems[0];

  return ikeaChearProduct;
}

export function createIkeaTable(id: number): ProductItem {
  return {
    id,
    name: "table2",
    thumbnail: "assets/models/pbr/thumbnail_ikea_table.png",
    models: [ getIkeaTableModel() ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "A quite plastic looking table, but it's wood!!",
    subItems: [],

    activeEvents: [],
  };
}
