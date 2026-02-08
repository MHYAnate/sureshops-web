import { api } from "@/lib/api";
import { State, Area, Market } from "@/types";

export const locationService = {
  async getStates(): Promise<State[]> {
    return api.get<State[]>("/states");
  },

  async getAreasByState(stateId: string): Promise<Area[]> {
    return api.get<Area[]>(`/areas/state/${stateId}`);
  },

  async getMarketsByArea(areaId: string): Promise<Market[]> {
    return api.get<Market[]>(`/markets/area/${areaId}`);
  },

  async getMarketById(id: string): Promise<Market> {
    return api.get<Market>(`/markets/${id}`);
  },

  async getNearbyMarkets(longitude: number, latitude: number, distance?: number): Promise<Market[]> {
    const params = new URLSearchParams({
      longitude: String(longitude),
      latitude: String(latitude),
    });
    if (distance) params.append("distance", String(distance));
    return api.get<Market[]>(`/markets/nearby?${params.toString()}`);
  },
};