import { STATE_NAMES } from "@/lib/types";
import type { Summary } from "@/lib/types";
import summaryData from "../../public/data/summary.json";
import ClinicList from "@/components/ClinicList";
import clinicsData from "../../public/data/clinics.json";
import type { Clinic } from "@/lib/types";

const summary = summaryData as Summary;
const clinics = clinicsData as Clinic[];

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find a GP Clinic Near You
          </h1>
          <p className="text-lg text-emerald-100 mb-2">
            {summary.total.toLocaleString()} GP clinics and medical centres across Australia
          </p>
          <p className="text-sm text-emerald-200">
            Free directory · No booking pressure · Real data from OpenStreetMap
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-700">{summary.total.toLocaleString()}</div>
              <div className="text-sm text-slate-500">Clinics Listed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{summary.with_phone.toLocaleString()}</div>
              <div className="text-sm text-slate-500">With Phone</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{summary.with_hours.toLocaleString()}</div>
              <div className="text-sm text-slate-500">With Hours</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-700">{Object.keys(summary.by_state).length}</div>
              <div className="text-sm text-slate-500">States & Territories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section id="states" className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">Browse by State</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATES.map((st) => (
              <a
                key={st}
                href={`/state/${st.toLowerCase()}`}
                className="card bg-white shadow-md hover:shadow-lg transition-shadow border border-slate-100"
              >
                <div className="card-body p-4 text-center">
                  <h3 className="font-semibold text-emerald-800">{STATE_NAMES[st]}</h3>
                  <p className="text-2xl font-bold text-slate-700">
                    {(summary.by_state[st] || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">clinics</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* All Clinics */}
      <section id="map" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-slate-800">All Clinics</h2>
          <ClinicList clinics={clinics} />
        </div>
      </section>
    </div>
  );
}
