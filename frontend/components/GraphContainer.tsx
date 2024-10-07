'use client'

import React, {useState, useEffect} from "react";

import {
    ControlsContainer,
    FullScreenControl,
    SigmaContainer,
    ZoomControl,
    useRegisterEvents,
    useSigma,
} from "@react-sigma/core";

import "@react-sigma/core/lib/react-sigma.min.css";

import {NodeType} from "@/types/NodeType";
import {Popup} from "@/components/Popup";
import {WikidataGraph} from "@/components/WikidataGraph";
import {SearchBar} from "@/components/SearchBar";

import node from "@/data/node.json";
import edge from "@/data/edge.json";
import {EdgeColorDisplay} from "@/components/EdgeColorDisplay";

const GraphEvents: React.FC<{ setPopup: (node: NodeType | null) => void }> = ({ setPopup }) => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);

    useEffect(() => {
        registerEvents({
            enterNode: (event) => {
                const nodeId = event.node;
                const x = event.event.x;
                const y = event.event.y;
                const nodeInfo = sigma.getGraph().getNodeAttributes(nodeId);

                const convertedNodeInfo: NodeType = {
                    id: nodeInfo.id,
                    label: nodeInfo.wikidata_label,
                    x: x + 10,
                    y: y + 10,
                }

                setPopup(convertedNodeInfo);
            },
            enterEdge: () => {
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
    }, [registerEvents, sigma, draggedNode, setPopup]);

    return null;
};

export default function GraphContainer({ propertyColorMap }: { propertyColorMap: Record<string, string> }) {
    const [popup, setPopup] = useState<NodeType | null>(null);

    const sigmaStyle = { height: "770px", width: "1920px" }

    const settings = {
        allowInvalidContainer: true,
        enableEdgeEvents: true,
        renderEdgeLabels: true,
    }

    return (
        <SigmaContainer style={sigmaStyle} settings={settings} >
            <ControlsContainer position={"top-left"}>
                <EdgeColorDisplay propertyColorMap={propertyColorMap} />
            </ControlsContainer>
            <WikidataGraph nodes={node} edges={edge} propertyColorMap={propertyColorMap} />
            <GraphEvents setPopup={setPopup} />
            <ControlsContainer position={"bottom-right"}>
                <ZoomControl />
                <FullScreenControl />
            </ControlsContainer>
            <ControlsContainer position={"top-right"}>
                <SearchBar style={{ width: "200px" }} />
            </ControlsContainer>
            <Popup nodeInfo={popup} />
        </SigmaContainer>
    );
}
