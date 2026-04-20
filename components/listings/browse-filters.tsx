"use client";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VEHICLE_MAKES, AFRICAN_COUNTRIES } from "@/lib/types";
import { useState } from "react";

interface Props {
  currentParams: {
    type?: string;
    make?: string;
    availability?: string;
    port?: string;
    min?: string;
    max?: string;
  };
}

export function BrowseFilters({ currentParams }: Props) {
  const router = useRouter();
  const [type, setType] = useState(currentParams.type ?? "");
  const [make, setMake] = useState(currentParams.make ?? "");
  const [availability, setAvailability] = useState(currentParams.availability ?? "");
  const [port, setPort] = useState(currentParams.port ?? "");
  const [min, setMin] = useState(currentParams.min ?? "");
  const [max, setMax] = useState(currentParams.max ?? "");

  function apply() {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (make) params.set("make", make);
    if (availability) params.set("availability", availability);
    if (port) params.set("port", port);
    if (min) params.set("min", min);
    if (max) params.set("max", max);
    router.push(`/browse?${params.toString()}`);
  }

  function clear() {
    setType(""); setMake(""); setAvailability(""); setPort(""); setMin(""); setMax("");
    router.push("/browse");
  }

  const makes = type === "bike" ? VEHICLE_MAKES.bike : VEHICLE_MAKES.car;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-sm font-semibold mb-3">Filters</h2>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Vehicle type</Label>
        <Select value={type || "all"} onValueChange={(v) => { setType(v === "all" ? "" : v); setMake(""); }}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="car">Cars</SelectItem>
            <SelectItem value="bike">Bikes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Make</Label>
        <Select value={make || "all"} onValueChange={(v) => setMake(v === "all" ? "" : v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All makes</SelectItem>
            {makes.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Availability</Label>
        <Select value={availability || "all"} onValueChange={(v) => setAvailability(v === "all" ? "" : v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="in_stock">In stock</SelectItem>
            <SelectItem value="en_route">En route</SelectItem>
            <SelectItem value="pre_order">Pre-order</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Ships to</Label>
        <Select value={port || "all"} onValueChange={(v) => setPort(v === "all" ? "" : v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any country</SelectItem>
            {AFRICAN_COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Price range (USD)</Label>
        <div className="flex gap-2">
          <Input
            className="h-8 text-sm"
            placeholder="Min"
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <Input
            className="h-8 text-sm"
            placeholder="Max"
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Button size="sm" className="w-full" onClick={apply}>Apply filters</Button>
        <Button size="sm" variant="ghost" className="w-full" onClick={clear}>Clear all</Button>
      </div>
    </div>
  );
}
