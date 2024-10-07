import {FC, useEffect, useRef} from "react";
import {useLayoutRandom} from "@react-sigma/layout-random";
import {useLoadGraph} from "@react-sigma/core";
import Graph from "graphology";
import {EdgeType} from "@/types/EdgeType";
import {NodeInputType} from "@/types/NodeInputType";

export interface GraphProps {
    nodes: Array<NodeInputType>,
    edges: Array<EdgeType>,
    propertyColorMap: Record<string, string>
}

export const WikidataGraph: FC<GraphProps> = (
    {
        nodes,
        edges,
        propertyColorMap
    }: GraphProps
) => {
    const {positions, assign} = useLayoutRandom();
    const loadGraph = useLoadGraph();

    const propertyColorMapRef = useRef(propertyColorMap);

    useEffect(() => {
        const graph = new Graph();

        nodes.forEach(
            node =>
                graph.addNode(node.id, {
                    x: 0,
                    y: 0,
                    size: 4,
                    color: "#000000",
                    label: node.label,
                    wikidata_label: node.label,
                })
        )

        edges.forEach(
            edge => {
                graph.addEdge(
                    edge.src,
                    edge.dst,
                    {
                        label: edge.property,
                        type: 'arrow',
                        color: propertyColorMapRef.current[edge.property]
                    },
                )
            }
        )

        loadGraph(graph);
        assign();
    }, [assign, loadGraph, positions, nodes, edges]);

    return null;
};
