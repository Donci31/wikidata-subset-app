export const EdgeColorDisplay = ({ propertyColorMap }: { propertyColorMap: Record<string, string> }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Properties</h2>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md">
                <ul className="space-y-2">
                    {Object.entries(propertyColorMap).map(([property, color], index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span className="font-medium">{property}</span>
                            <span className="ml-6 w-6 h-6 rounded-full" style={{ backgroundColor: color }}></span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
