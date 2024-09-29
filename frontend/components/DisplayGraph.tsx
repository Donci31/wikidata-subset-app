'use client'

import React, { FC, useEffect, CSSProperties } from "react";
import Graph from "graphology";

import { SigmaContainer, useLoadGraph, useRegisterEvents } from "@react-sigma/core";
import {useLayoutNoverlap} from "@react-sigma/layout-noverlap";
import "@react-sigma/core/lib/react-sigma.min.css";
import node from "./node.json"
import edge from "./edge.json"


const RandomCircleGraph: FC = () => {
    const { positions, assign } = useLayoutNoverlap();

    const loadGraph = useLoadGraph();

    useEffect(() => {
        const graph = new Graph();

        for (let i = 0; i < node.length; i++) {
            graph.addNode(node[i].id, {
                label: node[i].label,
                size: 4,
                x: 0,
                y: 0,
            });
        }

        for (let i = 0; i < edge.length; i++) {
            graph.addEdge(edge[i].src, edge[i].dst);
        }

        loadGraph(graph);

        assign();
    }, [assign, loadGraph, positions]);

    return null;
};

const GraphEvents: React.FC = () => {
    const registerEvents = useRegisterEvents();

    useEffect(() => {
        registerEvents({
            enterNode: (event) => console.log("enterNode", event.node),
            leaveNode: (event) => console.log("leaveNode", event.node),
        });
    }, [registerEvents]);

    return null;
};

export const DisplayGraph: FC<{ style: CSSProperties }> = ({ style }) => {
    return (
        <SigmaContainer style={style} >
            <RandomCircleGraph />
            <GraphEvents />
        </SigmaContainer>
    );
};