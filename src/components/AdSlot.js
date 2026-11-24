export default function AdSlot({ label = "Advertisement", className = "" }) {
  return (
    <aside
      aria-label={label}
      className={`border border-gray-200 bg-white rounded-sm p-4 text-center ${className}`}
    >
      <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">
        {label}
      </p>
      <div className="min-h-[90px] flex items-center justify-center bg-gray-50 border border-dashed border-gray-200 text-xs text-gray-400">
        AdSense Unit Slot
      </div>
    </aside>
  );
}
