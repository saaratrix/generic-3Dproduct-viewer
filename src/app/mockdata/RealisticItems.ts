import { ProductItem } from "../3D/models/ProductItem";
import { SubProductItem } from "../3D/models/SubProductItem";
import { ikeaChearModel, ikeaTableModel, wayfairChairModel, wayfairTableModel } from "./Models";
import { ProductConfigurationEvent } from "../product-configurator-events";

export function createWayfairTable(id: number): ProductItem {
  return {
    id,
    thumbnail: "assets/models/pbr/thumbnail_wayfair_table.png",
    models: [ wayfairTableModel ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "",
    subItems: [],
  };
}

export function createWayfairChair(id: number): ProductItem {
  return {
    id,
    thumbnail: "assets/models/pbr/thumbnail_wayfair_chair.png",
    models: [ wayfairChairModel ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "",
    subItems: [],
  };
}

// That typo... well it's fun to keep using it for this little example.
export function createIkeaChear(id: number): ProductItem {
  const ikeaChearProduct = {
    id,
    thumbnail: "assets/models/pbr/thumbnail_ikea_chair.png",
    models: [ ikeaChearModel ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "",
    subItems: [],
    selectedSubItem: null
  };

  const chearSubItems: SubProductItem[] = [];
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
    thumbnail: "assets/models/pbr/thumbnail_ikea_table.png",
    models: [ ikeaTableModel ],
    hasFloor: false,
    useGammaSpace: true,
    tooltip: "",
    subItems: [],
  };
}
