"use client";

import { useState } from "react";
import { useSiteLanguage } from "@/components/providers/LanguageContext";

export default function ImageUploadField({ fieldClass }: { fieldClass: string }) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    setUploading(true);
    setMessage(isArabic ? "جارٍ رفع الصورة..." : "Uploading image...");
    setError(false);

    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(isArabic ? "تعذر رفع الصورة. تحقق من نوع الملف وحجمه." : result.error || "Image upload failed.");

      const imageInput = document.querySelector<HTMLInputElement>('input[name="imageUrl"]');
      if (!imageInput) throw new Error("Image field is unavailable.");
      imageInput.value = result.url;
      setMessage(isArabic ? `تم الرفع: ${file.name}` : `Uploaded: ${file.name}`);
    } catch (uploadError) {
      setError(true);
      setMessage(isArabic ? "تعذر رفع الصورة. حاول مرة أخرى." : uploadError instanceof Error ? uploadError.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm">Cover image URL<input name="imageUrl" type="text" inputMode="url" required placeholder="https://... or upload an image" className={fieldClass} /></label>
      <label className="inline-flex cursor-pointer items-center rounded-md border border-[#d8d3c8] bg-white px-3 py-2 text-sm hover:bg-[#f4f1ea]">
        <span>{uploading ? (isArabic ? "جارٍ الرفع..." : "Uploading...") : (isArabic ? "اختر صورة من جهازك" : "Choose image from device")}</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploading} onChange={uploadImage} />
      </label>
      <p className={`text-xs ${error ? "text-red-700" : "text-neutral-500"}`} role={error ? "alert" : "status"}>
        {message || (isArabic ? "JPEG أو PNG أو WebP، حتى 10 ميغابايت." : "JPEG, PNG or WebP, up to 10 MB.")}
      </p>
    </div>
  );
}