export interface State {
  id: string;
  name: string;
  code: string;
  capital?: string;
  isActive: boolean;
}

export interface Area {
  id: string;
  name: string;
  stateId: string;
  localGovernment?: string;
  postalCode?: string;
  isActive: boolean;
}

export interface Market {
  id: string;
  name: string;
  type: 'traditional_market' | 'shopping_mall' | 'plaza' | 'shopping_complex' | 'street_market';
  stateId: string;
  areaId: string;
  address?: string;
  landmark?: string;
  entrancePhoto?: string;
  layoutMap?: string;
  totalShops: number;
  isActive: boolean;
  isVerified: boolean;
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