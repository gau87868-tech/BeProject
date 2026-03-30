export default function Loader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-blue-600 font-semibold text-lg">Loading...</p>
      </div>
    </div>
  );
}