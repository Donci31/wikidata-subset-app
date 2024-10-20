import React, {useEffect, useState} from "react";
import NodeType from "@/types/NodeType";
import {useRegisterEvents, useSigma} from "@react-sigma/core";
import node from "@/data/node.json";


interface GraphEventProps {
    setPopup: (node: NodeType | null) => void;
}


const GraphEvents: React.FC<GraphEventProps> = ({ setPopup }: GraphEventProps) => {
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

                const target = node.find(node => node.id === draggedNode)

                if (target) {
                    target.x = pos.x;
                    target.y = pos.y;
                }

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
}

export default GraphEvents;
