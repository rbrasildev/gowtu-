export default function Loading() {
  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center gap-3">
        <div className="skeleton h-11 w-11 rounded-lg" />
        <div className="flex flex-col gap-2">
          <div className="skeleton h-5 w-40 rounded" />
          <div className="skeleton h-3 w-56 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-lg" />
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="skeleton h-64 rounded-lg" />
        <div className="skeleton h-64 rounded-lg" />
      </div>
    </div>
  );
}
