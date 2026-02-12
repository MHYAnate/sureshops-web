"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Badge, Button } from "@/components/ui";
import { LoadingState } from "@/components/common";
import { locationService } from "@/services/location.service";
import { useAreasByState, useMarketsByArea } from "@/hooks/use-location";
import { MapPin, Building, Store, ChevronRight } from "lucide-react";

export default function AdminLocationsPage() {
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("");

  const { data: states, isLoading: statesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: () => locationService.getStates(),
  });

  const { data: areas, isLoading: areasLoading } =
    useAreasByState(selectedStateId);

  const { data: markets, isLoading: marketsLoading } =
    useMarketsByArea(selectedAreaId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Locations</h1>
        <p className="text-muted-foreground">
          Manage states, areas, and markets
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{states?.length || 0}</p>
              <p className="text-sm text-muted-foreground">States</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{areas?.length || "—"}</p>
              <p className="text-sm text-muted-foreground">
                Areas {selectedStateId ? "in selected state" : ""}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Store className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{markets?.length || "—"}</p>
              <p className="text-sm text-muted-foreground">
                Markets {selectedAreaId ? "in selected area" : ""}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* States List */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            States
          </h3>
          {statesLoading ? (
            <LoadingState />
          ) : (
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {states?.map((state: any) => (
                <button
                  key={state.id}
                  onClick={() => {
                    setSelectedStateId(state.id);
                    setSelectedAreaId("");
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    selectedStateId === state.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span>
                    {state.name}{" "}
                    <span className="opacity-60">({state.code})</span>
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Areas List */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Areas
            {selectedStateId && (
              <Badge variant="outline" className="ml-auto">
                {areas?.length || 0}
              </Badge>
            )}
          </h3>
          {!selectedStateId ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Select a state to view areas
            </p>
          ) : areasLoading ? (
            <LoadingState />
          ) : areas && areas.length > 0 ? (
            <div className="space-y-1 max-h-[500px] overflow-y-auto">
              {areas.map((area: any) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedAreaId(area.id)}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                    selectedAreaId === area.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="text-left">
                    <span>{area.name}</span>
                    {area.localGovernment && (
                      <p
                        className={`text-xs ${selectedAreaId === area.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                      >
                        {area.localGovernment}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No areas found
            </p>
          )}
        </Card>

        {/* Markets List */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Store className="h-4 w-4" />
            Markets
            {selectedAreaId && (
              <Badge variant="outline" className="ml-auto">
                {markets?.length || 0}
              </Badge>
            )}
          </h3>
          {!selectedAreaId ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Select an area to view markets
            </p>
          ) : marketsLoading ? (
            <LoadingState />
          ) : markets && markets.length > 0 ? (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {markets.map((market: any) => (
                <div
                  key={market.id}
                  className="rounded-lg border border-border p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{market.name}</p>
                    <Badge variant="outline" className="text-xs">
                      {market.type?.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  {market.address && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {market.address}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {market.openingTime && (
                      <span>
                        {market.openingTime} - {market.closingTime}
                      </span>
                    )}
                    <span>{market.totalShops} shops</span>
                    {market.isVerified && (
                      <Badge variant="success" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No markets found
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}