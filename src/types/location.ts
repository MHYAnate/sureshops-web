export interface State {
  id: string;
  name: string;
  code: string;
  capital?: string;
  country?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  isActive: boolean;
}

export interface Area {
  id: string;
  name: string;
  stateId: string | { id: string; name: string; code: string };
  localGovernment?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  postalCode?: string;
  isActive: boolean;
}

export interface Market {
  id: string;
  name: string;
  type: string;
  stateId: string | { id: string; name: string; code: string };
  areaId: string | { id: string; name: string };
  address?: string;
  landmark?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  entrancePhoto?: string;
  openingTime?: string;
  closingTime?: string;
  operatingDays?: string[];
  totalShops: number;
  isActive: boolean;
  isVerified: boolean;
}

export interface LocationSelection {
  stateId?: string;
  stateName?: string;
  areaId?: string;
  areaName?: string;
  marketId?: string;
  marketName?: string;
}


export interface LocationInfo {
  state: { id: string; name: string };
  area: { id: string; name: string };
  market?: { id: string; name: string; type: string };
  shopNumber?: string;
  shopFloor?: string;
  shopBlock?: string;
  shopAddress?: string;
  landmark?: string;
  coordinates?: [number, number];
  distance?: number;
}