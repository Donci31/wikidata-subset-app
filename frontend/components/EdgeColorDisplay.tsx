import {ColorMapType} from "@/types/ColorMapType";

export const EdgeColorDisplay = (
    { propertyColorMap, onColorChange }: {
        propertyColorMap: Map<string, ColorMapType>,
        onColorChange: (property: string, newColor: ColorMapType) => void
    }) => {
    return (
        <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Properties</h2>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4 shadow-md">
                <ul className="space-y-2">
                    {propertyColorMap.entries().map(([property, color], index) => (
                        <li key={index} className="flex justify-between items-center">
                            <span className="font-medium">{property}</span>
                            <input
                                type="color"
                                value={color.color}
                                onChange={(e) => {
                                    color.color = e.target.value;

                                    onColorChange(property, color);
                                }}
                                className="ml-6 w-6 h-6 rounded-full cursor-pointer border-none p-0"
                                style={{ backgroundColor: color.color }}
                            />
                        </li>
                    )).toArray()}
                </ul>
            </div>
        </div>
    );
};
