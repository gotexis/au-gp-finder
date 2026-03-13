#!/usr/bin/env python3
"""Process OSM Overpass data into site-ready JSON for AU GP Finder."""
import json, sys, re, hashlib
from collections import defaultdict

INPUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/au-gp-clinics.json"
OUT_DIR = "public/data"

# State bounding boxes (lat ranges)
STATE_BOUNDS = {
    "NSW": {"lat": (-37.6, -28.0), "lon": (140.9, 154.0)},
    "VIC": {"lat": (-39.2, -33.9), "lon": (140.9, 150.1)},
    "QLD": {"lat": (-29.2, -9.9), "lon": (137.9, 153.6)},
    "SA":  {"lat": (-38.1, -25.9), "lon": (128.9, 141.1)},
    "WA":  {"lat": (-35.2, -13.5), "lon": (112.9, 129.1)},
    "TAS": {"lat": (-43.7, -39.4), "lon": (143.5, 148.5)},
    "NT":  {"lat": (-26.1, -10.9), "lon": (128.9, 138.1)},
    "ACT": {"lat": (-35.95, -35.1), "lon": (148.7, 149.4)},
}

def guess_state(lat, lon):
    # ACT first (smaller, inside NSW)
    b = STATE_BOUNDS["ACT"]
    if b["lat"][0] <= lat <= b["lat"][1] and b["lon"][0] <= lon <= b["lon"][1]:
        return "ACT"
    for state, b in STATE_BOUNDS.items():
        if state == "ACT": continue
        if b["lat"][0] <= lat <= b["lat"][1] and b["lon"][0] <= lon <= b["lon"][1]:
            return state
    return "OTHER"

def make_slug(name, osm_id):
    s = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    return f"{s}-{osm_id}"

with open(INPUT) as f:
    raw = json.load(f)

clinics = []
by_state = defaultdict(list)

for el in raw["elements"]:
    tags = el.get("tags", {})
    name = tags.get("name", "").strip()
    if not name:
        continue
    
    lat, lon = el["lat"], el["lon"]
    state = tags.get("addr:state", "").upper() or guess_state(lat, lon)
    
    # Build address
    addr_parts = []
    for k in ["addr:unit", "addr:housenumber", "addr:street"]:
        if k in tags: addr_parts.append(tags[k])
    suburb = tags.get("addr:suburb", tags.get("addr:city", ""))
    postcode = tags.get("addr:postcode", "")
    if suburb: addr_parts.append(suburb)
    if state and state != "OTHER": addr_parts.append(state)
    if postcode: addr_parts.append(postcode)
    address = ", ".join(addr_parts) if addr_parts else ""
    
    # Phone
    phone = tags.get("phone", tags.get("phone:AU", tags.get("contact:phone", "")))
    
    # Type
    amenity = tags.get("amenity", "")
    hc = tags.get("healthcare", "")
    clinic_type = "gp"
    if hc and hc not in ("doctor", "clinic", "yes"):
        clinic_type = hc
    
    # Bulk billing — OSM doesn't have this reliably, mark as unknown
    bulk_billing = tags.get("bulk_billing", "unknown")
    
    clinic = {
        "id": make_slug(name, el["id"]),
        "osm_id": el["id"],
        "name": name,
        "lat": round(lat, 6),
        "lon": round(lon, 6),
        "state": state if state != "OTHER" else "",
        "suburb": suburb,
        "postcode": postcode,
        "address": address,
        "phone": phone,
        "website": tags.get("website", tags.get("contact:website", "")),
        "hours": tags.get("opening_hours", ""),
        "type": clinic_type,
        "bulk_billing": bulk_billing,
    }
    clinics.append(clinic)
    if state and state != "OTHER":
        by_state[state].append(clinic)

# Write all clinics
with open(f"{OUT_DIR}/clinics.json", "w") as f:
    json.dump(clinics, f, separators=(',', ':'))

# Write per-state
for state, items in by_state.items():
    with open(f"{OUT_DIR}/clinics-{state.lower()}.json", "w") as f:
        json.dump(items, f, separators=(',', ':'))

# Write summary
summary = {
    "total": len(clinics),
    "by_state": {s: len(items) for s, items in sorted(by_state.items())},
    "with_phone": sum(1 for c in clinics if c["phone"]),
    "with_hours": sum(1 for c in clinics if c["hours"]),
    "with_address": sum(1 for c in clinics if c["address"]),
    "with_website": sum(1 for c in clinics if c["website"]),
}
with open(f"{OUT_DIR}/summary.json", "w") as f:
    json.dump(summary, f, indent=2)

print(json.dumps(summary, indent=2))
