import GraphContainer from "@/components/GraphContainer";

export default async function SubsetPage({ params }: { params: { id: string } }) {
    const sigmaStyle = { height: "900px", width: "1920px" };

    const settings = {
        allowInvalidContainer: true,
        enableEdgeEvents: true,
        renderEdgeLabels: true,
    };

    const { default: node } = await import(`@/data/node${params.id}.json`, { with: { type: "json" } });
    const { default: edge } = await import(`@/data/edge${params.id}.json`, { with: { type: "json" } });

    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <GraphContainer node={node} edge={edge} sigmaStyle={sigmaStyle} settings={settings}></GraphContainer>
        </main>
    );
}
