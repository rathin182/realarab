"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { useSiteLanguage } from "@/components/providers/LanguageContext";

type UploadedMedia = { url: string; name: string };
type UrlImage = { id: number; url: string };

export default function ImageUploadField({ fieldClass }: { fieldClass: string }) {
  const { language } = useSiteLanguage();
  const isArabic = language === "ar";
  const mediaInput = useRef<HTMLInputElement>(null);
  const nextUrlImageId = useRef(0);
  const [images, setImages] = useState<UploadedMedia[]>([]);
  const [urlImages, setUrlImages] = useState<UrlImage[]>([]);
  const [coverUrl, setCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const extraImageUrls = [...new Set(urlImages.map((image) => image.url.trim()).filter((url) => isValidImageUrl(url) && url !== coverUrl.trim()))];

  function isValidImageUrl(value: string) {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }

  function addUrlImage() {
    const id = nextUrlImageId.current++;
    setUrlImages((current) => [...current, { id, url: "" }]);
  }

  async function uploadFiles(files: FileList | File[]) {
    if (!files.length) return;
    setUploading(true);
    setMessage(isArabic ? "جارٍ رفع الملفات..." : "Uploading files...");
    setError(false);

    try {
      let hasVideo = Boolean(videoUrl);
      for (const file of Array.from(files)) {
        const isVideo = file.type.startsWith("video/");
        if (isVideo && hasVideo) continue;
        const formData = new FormData();
        formData.set("file", file);
        const response = await fetch("/api/admin/uploads", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Upload failed.");

        if (isVideo) {
          setVideoUrl(result.url);
          hasVideo = true;
        } else {
          setImages((current) => [...current, { url: result.url, name: file.name }]);
          setCoverUrl((current) => current || result.url);
        }
      }
      setMessage(isArabic ? "اكتمل رفع الملفات." : "Upload complete. Only one video can be attached.");
    } catch (uploadError) {
      setError(true);
      setMessage(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    void uploadFiles(event.dataTransfer.files);
  }

  function openFilePicker() {
    if (!uploading) mediaInput.current?.click();
  }

  function onDropZoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  function removeImage(url: string) {
    const nextImages = images.filter((image) => image.url !== url);
    setImages(nextImages);
    if (coverUrl === url) setCoverUrl(nextImages[0]?.url ?? "");
  }

  const previewImages = [
    ...images.map((image) => ({ url: image.url, name: image.name, uploaded: true })),
    ...(isValidImageUrl(coverUrl) && !images.some((image) => image.url === coverUrl) ? [{ url: coverUrl, name: isArabic ? "صورة الغلاف" : "Cover URL", uploaded: false }] : []),
    ...urlImages.filter((image) => isValidImageUrl(image.url) && image.url.trim() !== coverUrl.trim()).map((image) => ({ url: image.url.trim(), name: isArabic ? "صورة من رابط" : "URL image", uploaded: false })),
  ].filter((image, index, list) => list.findIndex((item) => item.url === image.url) === index);

  return (
    <div className="space-y-4">
      <input type="hidden" name="imageUrl" value={coverUrl} />
      <input type="hidden" name="galleryImageUrls" value={[...images.map((image) => image.url).filter((url) => url !== coverUrl), ...extraImageUrls].join("\n")} />
      <input type="hidden" name="videoUploadUrl" value={videoUrl} />
      <input ref={mediaInput} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,video/ogg" multiple className="sr-only" disabled={uploading} onChange={(event) => { if (event.currentTarget.files) void uploadFiles(event.currentTarget.files); event.currentTarget.value = ""; }} />
      <div role="button" tabIndex={0} aria-disabled={uploading} onClick={openFilePicker} onKeyDown={onDropZoneKeyDown} onDragOver={(event) => event.preventDefault()} onDrop={onDrop} className={`rounded-lg border-2 border-dashed border-[#cfc8ba] bg-white px-5 py-9 text-center transition-colors hover:border-[#8f7654] hover:bg-[#fcfbf8] ${uploading ? "cursor-wait opacity-70" : "cursor-pointer"}`}>
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[#f1eadf] text-[#8f7654]">+</div>
        <p className="mt-3 font-medium">{uploading ? (isArabic ? "جارٍ رفع الملفات..." : "Uploading files...") : (isArabic ? "اسحب الصور أو الفيديو وأفلتها هنا" : "Drop photos or a video here, or click to browse")}</p>
        <p className="mt-1 text-xs text-neutral-500">{isArabic ? "صور JPEG أو PNG أو WebP حتى 10 ميغابايت، وفيديو واحد حتى 100 ميغابايت." : "JPEG, PNG or WebP photos up to 10 MB; one video up to 100 MB."}</p>
      </div>
      {videoUrl && <div className="max-w-lg rounded-md border border-[#e3dfd5] bg-white p-2">
        <video src={videoUrl} controls className="max-h-64 w-full rounded" />
        <p className="mt-2 truncate text-xs text-neutral-600">{videoUrl.split("/").pop()}</p>
      </div>}
      <div className="space-y-3">
        <label className="block text-sm font-medium">{isArabic ? "رابط صورة الغلاف (اختياري)" : "Cover image URL (optional)"}
          <div className="mt-1.5 flex items-center gap-2">
            <input type="text" inputMode="url" value={coverUrl} onChange={(event) => setCoverUrl(event.currentTarget.value)} placeholder={isArabic ? "اتركه فارغًا لاستخدام صورة مرفوعة" : "Leave blank to use an uploaded photo"} className={`${fieldClass} mt-0 min-w-0 flex-1`} />
            {(isValidImageUrl(coverUrl) || urlImages.some((image) => isValidImageUrl(image.url))) && <button type="button" onClick={addUrlImage} className="h-11 shrink-0 rounded-md border border-[#d8d3c8] bg-white px-3 text-sm hover:bg-[#f4f1ea]">{isArabic ? "إضافة أخرى" : "Add another"}</button>}
          </div>
        </label>
        {urlImages.map((image, index) => <div key={image.id}>
          <div className="flex items-center gap-2">
            <input type="url" inputMode="url" value={image.url} onChange={(event) => {
              const nextUrl = event.currentTarget.value;
              setUrlImages((current) => current.map((item) => item.id === image.id ? { ...item, url: nextUrl } : item));
            }} placeholder={isArabic ? "أدخل رابط صورة" : "Enter image URL"} className={`${fieldClass} mt-0 min-w-0 flex-1`} />
            <button type="button" onClick={() => setUrlImages((current) => current.filter((item) => item.id !== image.id))} aria-label={`${isArabic ? "إزالة رابط الصورة" : "Remove image URL"} ${index + 2}`} className="grid h-10 w-10 shrink-0 place-items-center text-neutral-500 hover:text-red-700"><span aria-hidden="true">×</span></button>
          </div>
        </div>)}
      </div>
      {previewImages.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {previewImages.map((image) => <div key={image.url} className="group relative aspect-[4/3] overflow-hidden rounded-md border border-[#e3dfd5] bg-white">
          <img src={image.url} alt={image.name} onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} className="h-full w-full object-cover" />
          <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-2 py-1 text-xs text-white">{image.url === coverUrl ? (isArabic ? "صورة الغلاف" : "Cover image") : image.name}</span>
          {image.url !== coverUrl && <button type="button" onClick={() => setCoverUrl(image.url)} className="absolute end-1 top-1 rounded bg-white/90 px-2 py-1 text-xs text-[#234532] opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100">{isArabic ? "تعيين كغلاف" : "Set as cover"}</button>}
          {image.uploaded && <button type="button" onClick={() => removeImage(image.url)} aria-label={isArabic ? "إزالة الصورة" : "Remove image"} className="absolute start-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-white/90 text-lg text-neutral-700 hover:text-red-700">×</button>}
        </div>)}
      </div>}
      <p className={`text-xs ${error ? "text-red-700" : "text-neutral-500"}`} role={error ? "alert" : "status"}>{message || (isArabic ? "يمكنك رفع عدة صور وفيديو واحد." : "Upload multiple photos and one video.")}</p>
    </div>
  );
}