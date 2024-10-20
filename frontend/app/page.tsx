import GraphContainer from "@/components/GraphContainer";

export default function Home() {
    const sigmaStyle = { height: "900px", width: "1920px" };

    const settings = {
        allowInvalidContainer: true,
        enableEdgeEvents: true,
        renderEdgeLabels: true,
    };

    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <GraphContainer sigmaStyle={sigmaStyle} settings={settings}></GraphContainer>
        </main>
    );
}
