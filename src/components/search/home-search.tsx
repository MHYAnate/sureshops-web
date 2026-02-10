// // src/components/search/home-search.tsx
// "use client";

// import { useState, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import { MapPin, Search, ArrowRight, ChevronLeft } from "lucide-react";
// import { Button, Card } from "@/components/ui";
// import { LocationSelect } from "@/components/forms/location-select";

// export function HomeSearch() {
//   const router = useRouter();
//   const [step, setStep] = useState<"location" | "search">("location");
//   const [stateId, setStateId] = useState("");
//   const [areaId, setAreaId] = useState("");
//   const [marketId, setMarketId] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [areaName, setAreaName] = useState("");
//   const [marketName, setMarketName] = useState("");

//   const handleStateChange = useCallback((id: string) => {
//     setStateId(id);
//     setAreaId("");
//     setMarketId("");
//   }, []);

//   const handleAreaChange = useCallback((id: string) => {
//     setAreaId(id);
//     setMarketId("");
//   }, []);

//   const handleMarketChange = useCallback((id: string) => {
//     setMarketId(id);
//   }, []);

//   const handleLocationSet = () => {
//     if (!stateId || !areaId) return;
//     setStep("search");
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     const params = new URLSearchParams();
//     if (searchQuery.trim()) params.append("query", searchQuery.trim());
//     if (stateId) params.append("stateId", stateId);
//     if (areaId) params.append("areaId", areaId);
//     if (marketId) params.append("marketId", marketId);
//     params.append("searchType", "products");
//     router.push(`/search?${params.toString()}`);
//   };

//   if (step === "location") {
//     return (
//       <Card className="p-6 text-left shadow-2xl">
//         <div className="flex items-center gap-2 mb-4">
//           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//             <MapPin className="h-5 w-5 text-primary" />
//           </div>
//           <div>
//             <h3 className="font-semibold">Where are you shopping?</h3>
//             <p className="text-xs text-muted-foreground">
//               Select a location to find shops near you
//             </p>
//           </div>
//         </div>

//         <LocationSelect
//           initialStateId={stateId}
//           initialAreaId={areaId}
//           initialMarketId={marketId}
//           onStateChange={handleStateChange}
//           onAreaChange={handleAreaChange}
//           onMarketChange={handleMarketChange}
//           showMarket={true}
//         />

//         <Button
//           className="w-full mt-6"
//           size="lg"
//           onClick={handleLocationSet}
//           disabled={!stateId || !areaId}
//         >
//           Continue to Search
//           <ArrowRight className="ml-2 h-4 w-4" />
//         </Button>

//         <button
//           onClick={() => router.push("/search")}
//           className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
//         >
//           Skip location — search all of Nigeria
//         </button>
//       </Card>
//     );
//   }

//   return (
//     <Card className="p-6 text-left shadow-2xl">
//       <button
//         onClick={() => setStep("location")}
//         className="flex items-center gap-1 mb-4 text-sm text-primary hover:underline"
//       >
//         <ChevronLeft className="h-4 w-4" />
//         Change location
//       </button>

//       <form onSubmit={handleSearch}>
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
//           <input
//             type="text"
//             placeholder="What are you looking for? (e.g. iPhone 15, Nike shoes...)"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             autoFocus
//             className="w-full h-14 rounded-xl border border-input bg-background pl-12 pr-28 text-base outline-none transition-all focus:ring-2 focus:ring-ring"
//           />
//           <Button
//             type="submit"
//             className="absolute right-2 top-1/2 -translate-y-1/2"
//             size="lg"
//             disabled={!searchQuery.trim()}
//           >
//             Search
//           </Button>
//         </div>
//       </form>
//     </Card>
//   );
// }
// src/components/search/home-search.tsx
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, ArrowRight, ChevronLeft } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { LocationSelect } from "@/components/forms/location-select";

export function HomeSearch() {
  const router = useRouter();
  const [step, setStep] = useState<"location" | "search">("location");
  const [stateId, setStateId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStateChange = useCallback((id: string) => {
    setStateId(id);
    setAreaId("");
    setMarketId("");
  }, []);

  const handleAreaChange = useCallback((id: string) => {
    setAreaId(id);
    setMarketId("");
  }, []);

  const handleMarketChange = useCallback((id: string) => {
    setMarketId(id);
  }, []);

  const handleLocationSet = () => {
    if (!stateId || !areaId) return;
    setStep("search");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build params — always include location if set
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("query", searchQuery.trim());
    if (stateId) params.append("stateId", stateId);
    if (areaId) params.append("areaId", areaId);
    if (marketId) params.append("marketId", marketId);
    params.append("searchType", "products");

    // ✅ FIX: Add timestamp to force re-render when navigating to same route
    params.append("_t", Date.now().toString());

    router.push(`/search?${params.toString()}`);
  };

  if (step === "location") {
    return (
      <Card className="p-6 text-left shadow-2xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Where are you shopping?</h3>
            <p className="text-xs text-muted-foreground">
              Select a location to find shops near you
            </p>
          </div>
        </div>

        <LocationSelect
          initialStateId={stateId}
          initialAreaId={areaId}
          initialMarketId={marketId}
          onStateChange={handleStateChange}
          onAreaChange={handleAreaChange}
          onMarketChange={handleMarketChange}
          showMarket={true}
        />

        <Button
          className="w-full mt-6"
          size="lg"
          onClick={handleLocationSet}
          disabled={!stateId || !areaId}
        >
          Continue to Search
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        <button
          onClick={() => router.push("/search")}
          className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
        >
          Skip location — search all of Nigeria
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-left shadow-2xl">
      <button
        onClick={() => setStep("location")}
        className="flex items-center gap-1 mb-4 text-sm text-primary hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        Change location
      </button>

      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="What are you looking for? (e.g. iPhone 15, Nike shoes...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full h-14 rounded-xl border border-input bg-background pl-12 pr-28 text-base outline-none transition-all focus:ring-2 focus:ring-ring"
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            size="lg"
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </div>
      </form>
    </Card>
  );
}