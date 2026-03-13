"use client";

import { useState, useMemo } from "react";
import type { Clinic } from "@/lib/types";
import MapView from "./MapView";

interface ClinicListProps {
  clinics: Clinic[];
  showMap?: boolean;
}

export default function ClinicList({ clinics, showMap = true }: ClinicListProps) {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "map">("list");

  const filtered = useMemo(() => {
    if (!search.trim()) return clinics;
    const q = search.toLowerCase();
    return clinics.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.suburb.toLowerCase().includes(q) ||
        c.postcode.includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [clinics, search]);

  const markers = useMemo(
    () =>
      filtered.slice(0, 500).map((c) => ({
        lat: c.lat,
        lng: c.lon,
        label: c.name,
        popup: [c.address, c.phone].filter(Boolean).join(" · "),
        href: `/clinic/${c.id}`,
      })),
    [filtered]
  );

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by clinic name, suburb or postcode..."
          className="input input-bordered w-full bg-white shadow-sm text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-sm text-slate-500 mt-2">
          Showing {filtered.length.toLocaleString()} of {clinics.length.toLocaleString()} clinics
        </p>
      </div>

      {/* View Toggle */}
      {showMap && (
        <div className="flex gap-2 mb-4">
          <button
            className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setView("list")}
          >
            📋 List
          </button>
          <button
            className={`btn btn-sm ${view === "map" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setView("map")}
          >
            🗺️ Map
          </button>
        </div>
      )}

      {/* Map View */}
      {showMap && view === "map" && (
        <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
          <MapView markers={markers} height="500px" />
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 60).map((c) => (
            <a
              key={c.id}
              href={`/clinic/${c.id}`}
              className="card bg-white shadow-md hover:shadow-lg transition-shadow border border-slate-100"
            >
              <div className="card-body p-4">
                <h3 className="card-title text-base text-emerald-800">{c.name}</h3>
                {c.address && (
                  <p className="text-sm text-slate-600">📍 {c.address}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {c.phone && (
                    <span className="badge badge-outline badge-sm">📞 {c.phone}</span>
                  )}
                  {c.hours && (
                    <span className="badge badge-outline badge-sm">🕐 Hours listed</span>
                  )}
                  {c.website && (
                    <span className="badge badge-success badge-sm text-white">🌐 Website</span>
                  )}
                </div>
                {c.suburb && (
                  <p className="text-xs text-slate-400 mt-1">{c.suburb}{c.state ? `, ${c.state}` : ""}</p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      {filtered.length > 60 && view === "list" && (
        <p className="text-center text-slate-500 mt-6">
          Showing first 60 results. Use search to narrow down.
        </p>
      )}
    </div>
  );
}
