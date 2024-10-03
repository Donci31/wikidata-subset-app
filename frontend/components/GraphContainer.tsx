'use client'

import React, {useState, useEffect} from "react";

import {
    ControlsContainer,
    SearchControl,
    FullScreenControl,
    SigmaContainer,
    ZoomControl,
    useRegisterEvents,
    useSigma,
} from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";

import NodeInfo from "@/types/NodeInfo";
import {Popup} from "@/components/Popup";
import {WikidataGraph} from "@/components/WikidataGraph";

const GraphEvents: React.FC<{ setPopup: (node: NodeInfo | null) => void, nodeData: Map<string, NodeInfo> }> = ({ setPopup, nodeData }) => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);

    useEffect(() => {
        registerEvents({
            enterNode: (event) => {
                const nodeId = event.node;
                const nodeInfo = nodeData.get(nodeId);

                if (nodeInfo) {
                    const { x, y } = event.event;
                    setPopup({
                        ...nodeInfo,
                        x: x + 10,
                        y: y + 10,
                    });
                }
            },
            leaveNode: () => {
                setPopup(null);
            },
            downNode: (e) => {
                setDraggedNode(e.node);
                sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
            },
            mousemovebody: (e) => {
                if (!draggedNode) return;
                const pos = sigma.viewportToGraph(e);
                sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
                sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

                e.preventSigmaDefault();
                e.original.preventDefault();
                e.original.stopPropagation();
            },

            mouseup: () => {
                if (draggedNode) {
                    setDraggedNode(null);
                    sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
                }
            },

            mousedown: () => {
                if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
            },
        });
    }, [registerEvents, nodeData, sigma, draggedNode, setPopup]);

    return null;
};

export default function GraphContainer() {
    const [popup, setPopup] = useState<NodeInfo | null>(null);
    const [nodeData, setNodeData] = useState<Map<string, NodeInfo>>(new Map());

    const sigmaStyle = { height: "770px", width: "1920px" }

    const settings = {
        allowInvalidContainer: true,
        renderEdgeLabels: true,
    }

    return (
        <SigmaContainer style={sigmaStyle} settings={settings} >
            <WikidataGraph setNodeData={setNodeData} />
            <GraphEvents setPopup={setPopup} nodeData={nodeData} />
            <ControlsContainer position={"bottom-right"}>
                <ZoomControl />
                <FullScreenControl />
            </ControlsContainer>
            <ControlsContainer position={"top-right"}>
                <SearchControl style={{ width: "200px" }} />
            </ControlsContainer>
            <Popup nodeInfo={popup} />
        </SigmaContainer>
    );
}
