export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-[1200px] animate-pulse px-4 py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-lg bg-gray-200" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-gray-200" />
          <div className="h-6 w-1/4 rounded bg-gray-200" />
          <div className="h-24 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
