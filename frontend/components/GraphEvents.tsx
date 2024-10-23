import React, {useEffect, useState} from "react";
import NodeType from "@/types/NodeType";
import {useRegisterEvents, useSigma} from "@react-sigma/core";


interface GraphEventProps {
    nodes: NodeType[];
    setPopup: (node: string | null) => void;
}


const GraphEvents: React.FC<GraphEventProps> = ({ nodes, setPopup }: GraphEventProps) => {
    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);

    useEffect(() => {
        registerEvents({
            enterNode: (event) => {
                setPopup(event.node);
            },
            enterEdge: () => {
            },
            leaveNode: () => {
                setPopup(null);
            },
            downNode: (e) => {
                setDraggedNode(e.node);
            },
            mousemovebody: (e) => {
                if (!draggedNode) return;
                const pos = sigma.viewportToGraph(e);
                sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
                sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

                const target = nodes.find(node => node.id === draggedNode)

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
                }
            },

            mousedown: () => {
                if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
            },
        });
    }, [registerEvents, sigma, draggedNode, setPopup]);

    return null;
};

export default GraphEvents;
