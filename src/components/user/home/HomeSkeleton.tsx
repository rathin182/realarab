export function HomeSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-5" aria-busy="true" aria-label="Loading">
      <div className="h-[340px] rounded-3xl bg-[#E4DBCF]" />
      <div className="h-20 rounded-3xl bg-[#F1EBE2]" />
      <div className="rounded-3xl bg-[#F8F5F0] p-5">
        <div className="h-7 w-56 rounded bg-[#E4DBCF]" />
        <div className="mt-4 flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[270px] w-[260px] shrink-0 rounded-2xl bg-[#EDE5D9]" />
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-[#F8F5F0] p-5">
        <div className="h-7 w-48 rounded bg-[#E4DBCF]" />
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[120px] rounded-2xl bg-[#EDE5D9]" />
          ))}
        </div>
      </div>
    </div>
  );
}
