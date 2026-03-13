export interface Clinic {
  id: string;
  osm_id: number;
  name: string;
  lat: number;
  lon: number;
  state: string;
  suburb: string;
  postcode: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
  type: string;
  bulk_billing: string;
}

export interface Summary {
  total: number;
  by_state: Record<string, number>;
  with_phone: number;
  with_hours: number;
  with_address: number;
  with_website: number;
}

export const STATE_NAMES: Record<string, string> = {
  NSW: "New South Wales",
  VIC: "Victoria",
  QLD: "Queensland",
  SA: "South Australia",
  WA: "Western Australia",
  TAS: "Tasmania",
  NT: "Northern Territory",
  ACT: "Australian Capital Territory",
};

export const STATE_CENTERS: Record<string, [number, number]> = {
  NSW: [-33.8688, 151.2093],
  VIC: [-37.8136, 144.9631],
  QLD: [-27.4698, 153.0251],
  SA: [-34.9285, 138.6007],
  WA: [-31.9505, 115.8605],
  TAS: [-42.8821, 147.3272],
  NT: [-12.4634, 130.8456],
  ACT: [-35.2809, 149.1300],
};
