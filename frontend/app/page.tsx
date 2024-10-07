import GraphContainer from "@/components/GraphContainer";
import edge from "@/data/edge.json";

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const propertyColorMap: Record<string, string> = {}

edge.forEach(edge => {
    if (!propertyColorMap[edge.property]) {
        propertyColorMap[edge.property] = getRandomColor();
    }
})

export default function Home() {
    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <GraphContainer propertyColorMap={propertyColorMap} ></GraphContainer>
        </main>
    );
}
