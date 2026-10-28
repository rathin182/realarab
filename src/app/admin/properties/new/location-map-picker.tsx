"use client";

import { useMemo, useState } from "react";

type Props = { fieldClass: string; isArabic: boolean };
const DEFAULT_CENTER = "24.7136,46.6753";

function parseCoordinates(value: string) {
  const dms = /(-?\d+(?:\.\d+)?)\s*°\s*(\d+(?:\.\d+)?)\s*['′’]\s*(\d+(?:\.\d+)?)\s*["″”]?\s*([NSEW])/gi;
  const matches = [...value.matchAll(dms)];
  let latitude: number;
  let longitude: number;

  if (matches.length === 2 && value.replace(dms, "").replace(/[\s,;]+/g, "") === "") {
    const toDecimal = (match: RegExpMatchArray) => {
      const degrees = Number(match[1]);
      const minutes = Number(match[2]);
      const seconds = Number(match[3]);
      const direction = match[4].toUpperCase();
      if (minutes >= 60 || seconds >= 60 || (direction === "N" || direction === "S") && Math.abs(degrees) > 90 || (direction === "E" || direction === "W") && Math.abs(degrees) > 180) return null;
      const sign = direction === "S" || direction === "W" ? -1 : 1;
      return sign * (Math.abs(degrees) + minutes / 60 + seconds / 3600);
    };
    const latitudeMatch = matches.find((match) => /[NS]/i.test(match[4]));
    const longitudeMatch = matches.find((match) => /[EW]/i.test(match[4]));
    if (!latitudeMatch || !longitudeMatch) return null;
    const parsedLatitude = toDecimal(latitudeMatch);
    const parsedLongitude = toDecimal(longitudeMatch);
    if (parsedLatitude === null || parsedLongitude === null) return null;
    latitude = parsedLatitude;
    longitude = parsedLongitude;
  } else {
    const parts = value.trim().split(/[\s,;]+/).filter(Boolean);
    if (parts.length !== 2) return null;
    [latitude, longitude] = parts.map(Number);
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return { latitude, longitude };
}

export default function LocationMapPicker({ fieldClass, isArabic }: Props) {
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [coordinateText, setCoordinateText] = useState("");
  const coordinates = parseCoordinates(coordinateText);
  const address = [locality, city, state, "Saudi Arabia"].filter(Boolean).join(", ");
  const mapQuery = coordinates ? `${coordinates.latitude},${coordinates.longitude}` : address;
  const mapUrl = useMemo(
    () => `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery || DEFAULT_CENTER)}&z=15&output=embed`,
    [mapQuery],
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2">
          {isArabic ? "العنوان / الحي" : "Detailed address / locality"}
          <input name="locality" value={locality} onChange={(event) => setLocality(event.currentTarget.value)} placeholder={isArabic ? "الشارع، الحي، المبنى" : "Street, neighbourhood, building"} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">
          {isArabic ? "المدينة" : "City"}<span className="ms-1 text-red-700">*</span>
          <input name="city" required value={city} onChange={(event) => setCity(event.currentTarget.value)} placeholder={isArabic ? "مثال: الرياض" : "e.g. Riyadh"} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">
          {isArabic ? "المنطقة / الولاية" : "State / Region"}<span className="ms-1 text-red-700">*</span>
          <input name="state" required value={state} onChange={(event) => setState(event.currentTarget.value)} placeholder={isArabic ? "مثال: منطقة الرياض" : "e.g. Riyadh Province"} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          {isArabic ? "الإحداثيات (خط العرض، خط الطول)" : "Coordinates (latitude, longitude)"}
          <input
            name="coordinates"
            value={coordinateText}
            onChange={(event) => setCoordinateText(event.currentTarget.value)}
            placeholder="24.7136, 46.6753"
            inputMode="decimal"
            className={fieldClass}
            aria-describedby="coordinates-help"
          />
        </label>
        <input type="hidden" name="latitude" value={coordinates?.latitude ?? ""} />
        <input type="hidden" name="longitude" value={coordinates?.longitude ?? ""} />
      </div>
      <p id="coordinates-help" className="text-xs text-neutral-500">
        {isArabic
          ? "في خرائط Google، اضغط مطولًا على الموقع ثم انسخ الإحداثيات الظاهرة والصقها هنا."
          : "Paste decimal coordinates (24.7136, 46.6753) or degrees, minutes and seconds (22°39′38.7″N 88°23′48.1″E) from Google Maps."}
        {coordinateText && !coordinates && <span className="ms-1 text-red-700">{isArabic ? "أدخل الإحداثيات العشرية أو الدرجات والدقائق والثواني بالترتيب الصحيح." : "Enter valid decimal coordinates or DMS coordinates with N/S and E/W."}</span>}
      </p>
      <div className="overflow-hidden rounded-md border border-[#d8d3c8] bg-[#ece9e1]">
        <iframe
          key={mapUrl}
          title={isArabic ? "خريطة موقع العقار" : "Property location map"}
          src={mapUrl}
          className="h-64 w-full border-0 sm:h-72"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery || DEFAULT_CENTER)}`} target="_blank" rel="noreferrer" className="inline-flex text-xs font-medium text-[#0C3826] underline underline-offset-2">
        {isArabic ? "افتح خرائط Google لتحديد الموقع ونسخ الإحداثيات" : "Open Google Maps to find the location and copy its coordinates"}
      </a>
    </div>
  );
}
