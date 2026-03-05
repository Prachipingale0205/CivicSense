export default function UrgencyBadge({ label }) {
    const config = {
        Critical: 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]',
        High: 'bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]',
        Medium: 'bg-[#fffbeb] text-[#d97706] border border-[#fde68a]',
        Low: 'bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0]',
    };

    const classes = config[label] || 'bg-gray-100 text-gray-600 border border-gray-200';

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${classes} shadow-sm`}>
            {label === 'Critical' && (
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                </span>
            )}
            {label}
        </span>
    );
}
