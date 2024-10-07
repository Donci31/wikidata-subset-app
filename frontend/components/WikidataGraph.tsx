import { FC, useEffect } from "react";
import { useLoadGraph } from "@react-sigma/core";
import Graph from "graphology";
import { EdgeType } from "@/types/EdgeType";
import { NodeType } from "@/types/NodeType";
import {ColorMapType} from "@/types/ColorMapType";

export interface GraphProps {
    nodes: Array<NodeType>,
    edges: Array<EdgeType>,
    propertyColorMap: Map<string, ColorMapType>
}

export const WikidataGraph: FC<GraphProps> = (
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
                size: 4,
                color: "#000000",
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
                        color: propertyColorMap.get(edge.property)?.color,
                    },
                );
            }
        );

        loadGraph(graph);
    }, [propertyColorMap]);

    return null;
};
