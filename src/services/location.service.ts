import { api } from "@/lib/api";
import { State, Area, Market } from "@/types/location";

export const locationService = {
  // States
  async getStates(): Promise<State[]> {
    return api.get<State[]>("/states");
  },

  async getStateById(id: string): Promise<State> {
    return api.get<State>(`/states/${id}`);
  },

  async getStateByCode(code: string): Promise<State> {
    return api.get<State>(`/states/code/${code}`);
  },

  // Areas
  async getAreas(): Promise<Area[]> {
    return api.get<Area[]>("/areas");
  },

  async getAreasByState(stateId: string): Promise<Area[]> {
    return api.get<Area[]>(`/areas/state/${stateId}`);
  },

  async getAreaById(id: string): Promise<Area> {
    return api.get<Area>(`/areas/${id}`);
  },

  // Markets
  async getMarketsByArea(areaId: string): Promise<Market[]> {
    return api.get<Market[]>(`/markets/area/${areaId}`);
  },

  async getMarketById(id: string): Promise<Market> {
    return api.get<Market>(`/markets/${id}`);
  },

  async getNearbyMarkets(
    longitude: number,
    latitude: number,
    distance?: number
  ): Promise<Market[]> {
    const params = new URLSearchParams({
      longitude: String(longitude),
      latitude: String(latitude),
    });
    if (distance) params.append("distance", String(distance));
    return api.get<Market[]>(`/markets/nearby?${params.toString()}`);
  },
};