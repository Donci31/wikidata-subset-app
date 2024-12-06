import GraphContainer from "@/components/GraphContainer";
import {fetchSubset} from "@/app/subset/lib/data";

export default async function SubsetPage({ params }: { params: { id: string } }) {
    const sigmaStyle = { height: "900px", width: "1920px" };

    const settings = {
        allowInvalidContainer: true,
        enableEdgeEvents: true,
        renderEdgeLabels: true,
    };

    const data = await fetchSubset(params.id);

    const nodes = data.nodes || [];
    const edges = data.edges || [];
    const colormap = data.colormap || [];

    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <GraphContainer node={nodes} edge={edges} colorMap={colormap} sigmaStyle={sigmaStyle} settings={settings}></GraphContainer>
        </main>
    );
}
