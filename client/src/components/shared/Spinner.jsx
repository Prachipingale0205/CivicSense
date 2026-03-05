import { Loader2 } from 'lucide-react';

export default function Spinner({ size = 16 }) {
    return <Loader2 className="animate-spin" size={size} />;
}
