// ColorMapManager.ts
import ColorMapType from "@/types/ColorMapType";

class ColorMapManager {
    private readonly colorMap: Map<string, ColorMapType>;

    constructor(edges: ColorMapType[]) {
        this.colorMap = new Map<string, ColorMapType>();
        this.initializeColorMap(edges);
    }

    private initializeColorMap(colors: ColorMapType[]) {
        colors.forEach(color => {
            this.colorMap.set(color.id, color);
        });
    }

    public updateColor(property: string, newColor: ColorMapType) {
        this.colorMap.set(property, newColor);
    }

    public getColorMap() {
        return this.colorMap;
    }
}

export default ColorMapManager;
