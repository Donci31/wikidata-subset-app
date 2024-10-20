// ColorMapManager.ts
import ColorMapType from "@/types/ColorMapType";
import EdgeType from "@/types/EdgeType";

class ColorMapManager {
    private readonly colorMap: Map<string, ColorMapType>;

    constructor(edges: EdgeType[]) {
        this.colorMap = new Map<string, ColorMapType>();
        this.initializeColorMap(edges);
    }

    private getRandomColor(): string {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    private initializeColorMap(edges: EdgeType[]) {
        edges.forEach(edge => {
            if (!this.colorMap.has(edge.property)) {
                const color: ColorMapType = { property: edge.property, color: this.getRandomColor(), hidden: false };
                this.colorMap.set(edge.property, color);
            }
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
