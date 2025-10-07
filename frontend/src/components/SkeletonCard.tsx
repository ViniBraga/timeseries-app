const SkeletonCard = () => (
  <div className="bg-gray-100 border border-gray-300 shadow-sm rounded-lg p-4 animate-pulse">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="flex gap-3 mt-4">
      <div className="h-5 w-5 bg-gray-300 rounded"></div>
      <div className="h-5 w-5 bg-gray-300 rounded"></div>
    </div>
  </div>
);

export default SkeletonCard;