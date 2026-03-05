export default function UrgencyBadge({ label }) {
    const config = {
        Critical: 'bg-red-50 text-red-600 border-red-200',
        High: 'bg-orange-50 text-orange-600 border-orange-200',
        Medium: 'bg-amber-50 text-amber-600 border-amber-200',
        Low: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    };

    const classes = config[label] || 'bg-gray-100 text-gray-600 border-gray-200';

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${classes}`}>
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
