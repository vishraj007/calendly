export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex items-center space-x-1.5">
        {/* We use inline styles for the exact animation delays to match a smooth wave */}
        <div 
          className="w-2.5 h-2.5 bg-[#4B6382] rounded-full animate-bounce" 
          style={{ animationDelay: '0ms', animationDuration: '1s' }}
        ></div>
        <div 
          className="w-3 h-3 bg-[#4B6382] rounded-full animate-bounce" 
          style={{ animationDelay: '150ms', animationDuration: '1s' }}
        ></div>
        <div 
          className="w-3.5 h-3.5 bg-[#4B6382] rounded-full animate-bounce" 
          style={{ animationDelay: '300ms', animationDuration: '1s' }}
        ></div>
      </div>
    </div>
  );
}
