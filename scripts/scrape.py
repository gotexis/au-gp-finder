#!/usr/bin/env python3
"""Scrape AU GP clinics and medical centres from OpenStreetMap via Overpass API.
Free, no API key needed. Run: python3 scripts/scrape.py
Then: python3 scripts/process-data.py /tmp/au-gp-clinics.json
"""
import urllib.request, json, sys

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
QUERY = """[out:json][timeout:120];
area["ISO3166-1"="AU"]->.a;
(
  node["amenity"="doctors"](area.a);
  node["amenity"="clinic"](area.a);
  node["healthcare"="doctor"](area.a);
  way["amenity"="doctors"](area.a);
  way["amenity"="clinic"](area.a);
  way["healthcare"="doctor"](area.a);
);
out body center;"""

OUT = sys.argv[1] if len(sys.argv) > 1 else "/tmp/au-gp-clinics.json"

print(f"Querying Overpass API for AU GP clinics...")
data = urllib.parse.urlencode({"data": QUERY}).encode()
req = urllib.request.Request(OVERPASS_URL, data=data)
with urllib.request.urlopen(req, timeout=180) as resp:
    result = json.loads(resp.read())

print(f"Got {len(result['elements'])} elements")
with open(OUT, "w") as f:
    json.dump(result, f)
print(f"Saved to {OUT}")
print("Next: python3 scripts/process-data.py " + OUT)
