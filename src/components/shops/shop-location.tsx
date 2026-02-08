"use client";

import { MapPin, Navigation, Clock, Calendar } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui";
import { LocationInfo, OperatingHours } from "@/types";
import { isOpen as checkIsOpen } from "@/lib/utils";
import { DAYS_OF_WEEK } from "@/lib/constants";

interface ShopLocationProps {
  location: LocationInfo;
  operatingHours?: OperatingHours & { isOpen?: boolean };
}

export function ShopLocation({ location, operatingHours }: ShopLocationProps) {
  const shopIsOpen = operatingHours
    ? checkIsOpen(operatingHours.openingTime, operatingHours.closingTime)
    : undefined;

  const openMaps = () => {
    if (location.coordinates) {
      const [lng, lat] = location.coordinates;
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        "_blank"
      );
    } else {
      const query = [
        location.shopAddress,
        location.market?.name,
        location.area.name,
        location.state.name,
      ]
        .filter(Boolean)
        .join(", ");
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
        "_blank"
      );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Location & Hours</h3>
        {shopIsOpen !== undefined && (
          <Badge variant={shopIsOpen ? "success" : "secondary"}>
            {shopIsOpen ? "Open Now" : "Closed"}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex gap-3">
          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            {location.shopNumber && (
              <p className="font-medium">{location.shopNumber}</p>
            )}
            {location.shopFloor && (
              <p className="text-sm text-muted-foreground">
                Floor: {location.shopFloor}
                {location.shopBlock && `, Block: ${location.shopBlock}`}
              </p>
            )}
            {location.market && (
              <p className="text-sm">{location.market.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              {location.area.name}, {location.state.name}
            </p>
            {location.landmark && (
              <p className="text-xs text-muted-foreground mt-1">
                Landmark: {location.landmark}
              </p>
            )}
            {location.shopAddress && (
              <p className="text-sm text-muted-foreground mt-1">
                {location.shopAddress}
              </p>
            )}
          </div>
        </div>

        {/* Get Directions */}
        <Button variant="outline" className="w-full" onClick={openMaps}>
          <Navigation className="mr-2 h-4 w-4" />
          Get Directions
        </Button>

        {/* Operating Hours */}
        {operatingHours && (
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Operating Hours</span>
            </div>

            {operatingHours.is24Hours ? (
              <p className="text-sm">Open 24 hours</p>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <span>{operatingHours.openingTime}</span>
                <span className="text-muted-foreground">-</span>
                <span>{operatingHours.closingTime}</span>
              </div>
            )}

            {/* Operating Days */}
            {operatingHours.operatingDays && operatingHours.operatingDays.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Open Days</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {DAYS_OF_WEEK.map((day) => {
                    const isOpen = operatingHours.operatingDays?.includes(day);
                    return (
                      <Badge
                        key={day}
                        variant={isOpen ? "default" : "outline"}
                        className="text-xs"
                      >
                        {day.slice(0, 3)}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}