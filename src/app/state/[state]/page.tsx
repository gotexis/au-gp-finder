import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { STATE_NAMES } from "@/lib/types";
import type { Clinic } from "@/lib/types";
import ClinicList from "@/components/ClinicList";
import clinicsData from "../../../../public/data/clinics.json";

const clinics = clinicsData as Clinic[];
const STATES = Object.keys(STATE_NAMES);

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.toLowerCase() }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const st = state.toUpperCase();
  const name = STATE_NAMES[st];
  if (!name) return {};
  return {
    title: `GP Clinics in ${name}`,
    description: `Find GP clinics and doctors in ${name}, Australia. Free directory with maps and contact details.`,
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const st = state.toUpperCase();
  const name = STATE_NAMES[st];
  if (!name) notFound();

  const stateClinics = clinics.filter((c) => c.state === st);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="text-sm breadcrumbs mb-4">
        <ul>
          <li><a href="/" className="text-emerald-700">Home</a></li>
          <li>{name}</li>
        </ul>
      </nav>
      <h1 className="text-3xl font-bold mb-2 text-slate-800">
        GP Clinics in {name}
      </h1>
      <p className="text-slate-500 mb-8">
        {stateClinics.length.toLocaleString()} clinics found in {st}
      </p>
      <ClinicList clinics={stateClinics} />
    </div>
  );
}
