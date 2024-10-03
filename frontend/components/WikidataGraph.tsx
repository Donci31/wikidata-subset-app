import {FC, useEffect} from "react";
import NodeInfo from "@/types/NodeInfo";
import {useLayoutRandom} from "@react-sigma/layout-random";
import {useLoadGraph} from "@react-sigma/core";
import Graph from "graphology";
import node from "@/data/node.json";
import edge from "@/data/edge.json";

export const WikidataGraph: FC<{ setNodeData: (data: Map<string, NodeInfo>) => void }> = ({ setNodeData }) => {
    const { positions, assign } = useLayoutRandom();
    const loadGraph = useLoadGraph();

    useEffect(() => {
        const graph = new Graph();
        const nodeDataMap = new Map<string, NodeInfo>();

        for (let i = 0; i < node.length; i++) {
            graph.addNode(node[i].id, {
                x: 0,
                y: 0,
                label: node[i].label,
                size: 4,
            });
        }

        for (let i = 0; i < edge.length; i++) {
            graph.addEdge(edge[i].src, edge[i].dst, { label: edge[i].property });
        }

        loadGraph(graph);
        assign();

        graph.forEachNode((nodeId, attributes) => {
            const nodeInfo: NodeInfo = {
                id: nodeId,
                label: attributes.label,
                x: attributes.x,
                y: attributes.y,
            };
            nodeDataMap.set(nodeId, nodeInfo);
        });

        setNodeData(nodeDataMap);
    }, [assign, loadGraph, setNodeData, positions]);

    return null;
};
