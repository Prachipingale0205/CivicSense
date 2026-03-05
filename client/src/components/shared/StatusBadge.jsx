export default function StatusBadge({ status }) {
    const config = {
        Submitted: 'bg-blue-50 text-blue-600 border-blue-200',
        'Under Review': 'bg-amber-50 text-amber-600 border-amber-200',
        'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
        Resolved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
        Rejected: 'bg-red-50 text-red-600 border-red-200',
    };

    const classes = config[status] || 'bg-gray-100 text-gray-600 border-gray-200';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-colors ${classes}`}>
            {status}
        </span>
    );
}
