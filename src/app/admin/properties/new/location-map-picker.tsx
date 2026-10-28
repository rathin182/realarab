"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Props = { fieldClass: string; isArabic: boolean };
type LatLng = { lat: number; lng: number };
type MapEvent = { latLng?: { lat(): number; lng(): number } };
type AddressComponent = { long_name: string; types: string[] };
type GeocodeResult = { address_components: AddressComponent[]; geometry?: { location: { lat(): number; lng(): number } } };
type MapInstance = {
  addListener(event: string, handler: (event: MapEvent) => void): void;
  setCenter(position: LatLng): void;
};
type MarkerInstance = {
  setPosition(position: LatLng): void;
  addListener(event: string, handler: (event: MapEvent) => void): void;
};
type GoogleMaps = {
  Map: new (element: HTMLElement, options: { center: LatLng; zoom: number; mapTypeControl: boolean; streetViewControl: boolean }) => MapInstance;
  Marker: new (options: { map: MapInstance; position: LatLng; draggable: boolean }) => MarkerInstance;
  Geocoder: new () => {
    geocode(request: { address?: string; location?: LatLng }, callback: (results: GeocodeResult[] | null, status: string) => void): void;
  };
};

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };

export default function LocationMapPicker({ fieldClass, isArabic }: Props) {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<MapInstance | null>(null);
  const marker = useRef<MarkerInstance | null>(null);
  const geocoder = useRef<InstanceType<GoogleMaps["Geocoder"]> | null>(null);
  const skipAddressLookup = useRef(false);
  const [locality, setLocality] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  function updatePin(position: LatLng, reverseGeocode = true) {
    setLatitude(position.lat.toFixed(6));
    setLongitude(position.lng.toFixed(6));
    marker.current?.setPosition(position);

    if (reverseGeocode && geocoder.current) {
      geocoder.current.geocode({ location: position }, (results, statusCode) => {
        if (statusCode !== "OK" || !results?.[0]) return;
        const components = results[0].address_components;
        const find = (...types: string[]) => components.find((component) => types.some((type) => component.types.includes(type)))?.long_name ?? "";
        skipAddressLookup.current = true;
        setLocality(find("sublocality_level_1", "neighborhood", "route"));
        setCity(find("locality", "administrative_area_level_2"));
        setState(find("administrative_area_level_1"));
      });
    }
  }

  function initializeMap() {
    const maps = (window as Window & { google?: { maps: GoogleMaps } }).google?.maps;
    if (!maps || !mapElement.current || map.current) return;
    map.current = new maps.Map(mapElement.current, {
      center: DEFAULT_CENTER,
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
    });
    marker.current = new maps.Marker({ map: map.current, position: DEFAULT_CENTER, draggable: true });
    geocoder.current = new maps.Geocoder();
    map.current.addListener("click", (event) => {
      if (event.latLng) updatePin({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });
    marker.current.addListener("dragend", (event) => {
      if (event.latLng) updatePin({ lat: event.latLng.lat(), lng: event.latLng.lng() });
    });
    setMapReady(true);
  }

  useEffect(() => {
    const address = [locality, city, state].map((part) => part.trim()).filter(Boolean).join(", ");
    if (skipAddressLookup.current) {
      skipAddressLookup.current = false;
      return;
    }
    if (!address || !geocoder.current) return;
    const timer = window.setTimeout(() => {
      geocoder.current?.geocode({ address: `${address}, Saudi Arabia` }, (results, statusCode) => {
        const location = statusCode === "OK" ? results?.[0]?.geometry?.location : undefined;
        if (!location) return;
        const position = { lat: location.lat(), lng: location.lng() };
        setLatitude(position.lat.toFixed(6));
        setLongitude(position.lng.toFixed(6));
        marker.current?.setPosition(position);
        map.current?.setCenter(position);
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [locality, city, state, mapReady]);

  useEffect(() => {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!latitude || !longitude || !Number.isFinite(lat) || !Number.isFinite(lng) || !map.current) return;
    const position = { lat, lng };
    marker.current?.setPosition(position);
    map.current.setCenter(position);
  }, [latitude, longitude]);

  return (
    <div className="space-y-4">
      {apiKey && <Script src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`} strategy="afterInteractive" onLoad={initializeMap} onError={() => setMapError(true)} />}
      <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
        <label className="block text-sm font-medium sm:col-span-2">{isArabic ? "العنوان / الحي" : "Address / locality"}
          <input name="locality" value={locality} onChange={(event) => setLocality(event.currentTarget.value)} placeholder={isArabic ? "اكتب عنوان العقار" : "Type the property address"} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">{isArabic ? "المدينة" : "City"}<span className="ms-1 text-red-700">*</span>
          <input name="city" required value={city} onChange={(event) => setCity(event.currentTarget.value)} placeholder={isArabic ? "مثال: الرياض" : "e.g. Riyadh"} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">{isArabic ? "المنطقة / الولاية" : "State / Region"}<span className="ms-1 text-red-700">*</span>
          <input name="state" required value={state} onChange={(event) => setState(event.currentTarget.value)} placeholder={isArabic ? "مثال: منطقة الرياض" : "e.g. Riyadh Province"} className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">{isArabic ? "خط العرض" : "Latitude"}
          <input name="latitude" type="number" min="-90" max="90" step="any" value={latitude} onChange={(event) => setLatitude(event.currentTarget.value)} placeholder="24.7136" className={fieldClass} />
        </label>
        <label className="block text-sm font-medium">{isArabic ? "خط الطول" : "Longitude"}
          <input name="longitude" type="number" min="-180" max="180" step="any" value={longitude} onChange={(event) => setLongitude(event.currentTarget.value)} placeholder="46.6753" className={fieldClass} />
        </label>
      </div>
      <div ref={mapElement} className="h-64 overflow-hidden rounded-md border border-[#d8d3c8] bg-[#ece9e1] sm:h-72" aria-label={isArabic ? "خريطة تحديد العقار" : "Property location map"} />
      {!apiKey ? (
        <p className="text-xs text-amber-800">{isArabic ? "أضف NEXT_PUBLIC_GOOGLE_MAPS_API_KEY لتفعيل الخريطة." : "Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the interactive map."}</p>
      ) : mapError ? (
        <p className="text-xs text-red-700">{isArabic ? "تعذر تحميل الخريطة. تحقق من مفتاح Google Maps وإعدادات واجهة API." : "Map unavailable. Check the Google Maps key and API settings."}</p>
      ) : (
        <p className="text-xs text-neutral-500">{mapReady ? (isArabic ? "اكتب عنوانًا أو اسحب الدبوس لتحديث الموقع والإحداثيات." : "Type an address or drag the pin to update the location and coordinates.") : (isArabic ? "جارٍ تحميل الخريطة..." : "Loading map...")}</p>
      )}
    </div>
  );
}
