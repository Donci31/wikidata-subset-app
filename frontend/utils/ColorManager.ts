import ColorMapType from "@/types/ColorMapType";
import EdgeType from "@/types/EdgeType";

export class ColorManager {
    private readonly colorMap: Map<string, ColorMapType>;

    constructor(edges: EdgeType[]) {
        this.colorMap = new Map<string, ColorMapType>();

        // Initialize color map from edges
        edges.forEach(edge => {
            if (!this.colorMap.has(edge.property)) {
                const color: ColorMapType = { property: edge.property, color: this.getRandomColor(), hidden: false };
                this.colorMap.set(edge.property, color);
            }
        });
    }

    // Get the current color map
    getColorMap() {
        return this.colorMap;
    }

    // Update color in the color map
    updateColor(property: string, newColor: ColorMapType) {
        this.colorMap.set(property, newColor);
    }

    // Utility to generate a random color
    private getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

export default ColorManager;
