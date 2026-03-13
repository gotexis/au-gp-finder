import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STATE_NAMES } from "@/lib/types";
import type { Clinic } from "@/lib/types";
import clinicsData from "../../../../public/data/clinics.json";
import MapView from "@/components/MapView";

const clinics = clinicsData as Clinic[];

export function generateStaticParams() {
  return clinics.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const clinic = clinics.find((c) => c.id === id);
  if (!clinic) return {};
  const location = [clinic.suburb, clinic.state].filter(Boolean).join(", ");
  return {
    title: clinic.name,
    description: `${clinic.name}${location ? ` in ${location}` : ""}. Find address, phone, opening hours and directions.`,
  };
}

export default async function ClinicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const clinic = clinics.find((c) => c.id === id);
  if (!clinic) notFound();

  const stateName = STATE_NAMES[clinic.state] || clinic.state;
  const markers = [{ lat: clinic.lat, lng: clinic.lon, label: clinic.name }];

  const nearby = clinics
    .filter((c) => c.id !== clinic.id && (
      (clinic.postcode && c.postcode === clinic.postcode) ||
      (clinic.suburb && c.suburb === clinic.suburb)
    ))
    .slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="text-sm breadcrumbs mb-4">
        <ul>
          <li><a href="/" className="text-emerald-700">Home</a></li>
          {clinic.state && (
            <li><a href={`/state/${clinic.state.toLowerCase()}`} className="text-emerald-700">{stateName}</a></li>
          )}
          <li>{clinic.name}</li>
        </ul>
      </nav>

      <h1 className="text-3xl font-bold mb-2 text-slate-800">{clinic.name}</h1>
      {clinic.suburb && (
        <p className="text-lg text-slate-500 mb-6">
          {clinic.suburb}{clinic.state ? `, ${clinic.state}` : ""}
        </p>
      )}

      <div className="rounded-xl overflow-hidden shadow-lg mb-8">
        <MapView markers={markers} center={[clinic.lat, clinic.lon]} zoom={15} height="300px" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-white shadow-md border border-slate-100">
          <div className="card-body">
            <h2 className="card-title text-emerald-800">Contact Details</h2>
            {clinic.address && (
              <p className="flex items-start gap-2"><span>📍</span><span>{clinic.address}</span></p>
            )}
            {clinic.phone && (
              <p className="flex items-center gap-2"><span>📞</span><a href={`tel:${clinic.phone}`} className="link link-primary">{clinic.phone}</a></p>
            )}
            {clinic.website && (
              <p className="flex items-center gap-2"><span>🌐</span><a href={clinic.website} target="_blank" rel="noopener noreferrer" className="link link-primary truncate">{clinic.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a></p>
            )}
          </div>
        </div>

        <div className="card bg-white shadow-md border border-slate-100">
          <div className="card-body">
            <h2 className="card-title text-emerald-800">Opening Hours</h2>
            {clinic.hours ? (
              <p className="whitespace-pre-wrap text-sm">{clinic.hours.replace(/;\s*/g, "\n")}</p>
            ) : (
              <p className="text-slate-400">Hours not available</p>
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg"
        >
          🧭 Get Directions
        </a>
      </div>

      {nearby.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">Nearby Clinics</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {nearby.map((c) => (
              <a key={c.id} href={`/clinic/${c.id}`} className="card bg-white shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="card-body p-3">
                  <h3 className="font-semibold text-emerald-800 text-sm">{c.name}</h3>
                  {c.address && <p className="text-xs text-slate-500">{c.address}</p>}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
