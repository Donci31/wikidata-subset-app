import { FC, useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import Graph from "graphology";
import EdgeType from "@/types/EdgeType";
import NodeType from "@/types/NodeType";
import ColorMapType from "@/types/ColorMapType";

interface GraphProps {
    nodes: NodeType[],
    edges: EdgeType[],
    propertyColorMap: Map<string, ColorMapType>
}

const WikidataGraph: FC<GraphProps> = (
    {
        nodes,
        edges,
        propertyColorMap
    }: GraphProps
) => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        const graph = new Graph();

        nodes.forEach(
            node => graph.addNode(node.id, {
                x: node.x,
                y: node.y,
                size: 5,
                color: "#000000",
                id: node.id,
                label: node.label,
                wikidata_label: node.label,
            })
        );

        // Add edges to the graph
        edges.forEach(
            edge => {
                graph.addEdge(
                    edge.src,
                    edge.dst,
                    {
                        label: edge.property,
                        type: 'arrow',
                        size: 2,
                        color: propertyColorMap.get(edge.property)?.color,
                        hidden: propertyColorMap.get(edge.property)?.hidden,
                    },
                );
            }
        );

        loadGraph(graph);
    }, [nodes, edges, propertyColorMap]);

    return null;
};

export default WikidataGraph;
