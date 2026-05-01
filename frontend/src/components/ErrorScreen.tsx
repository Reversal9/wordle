export function ErrorScreen() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 text-center px-4">
      <p className="text-xl font-semibold text-gray-800">
        Couldn't load today's puzzle
      </p>
      <p className="text-gray-500">
        Check your connection and try refreshing.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
      >
        Refresh
      </button>
    </div>
  )
}
