'use client'

import React, {useState, useEffect} from "react";

import {
    ControlsContainer,
    SigmaContainer,
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
import {ColorMapType} from "@/types/ColorMapType";
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddNodeDialog from "@/components/AddNodeDialog";


const GraphEvents: React.FC<{ setPopup: (node: NodeType | null) => void }> = ({setPopup}) => {
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
};

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export default function GraphContainer() {
    const [popup, setPopup] = useState<NodeType | null>(null);

    const sigmaStyle = {height: "900px", width: "1920px"}

    const settings = {
        allowInvalidContainer: true,
        enableEdgeEvents: true,
        renderEdgeLabels: true,
    }

    const initialColorMap: Map<string, ColorMapType> = new Map<string, ColorMapType>()

    edge.forEach(edge => {
        const colEdge = initialColorMap.get(edge.property)

        if (colEdge == undefined) {
            const color: ColorMapType = {property: edge.property, color: getRandomColor(), hidden: false}

            initialColorMap.set(edge.property, color);
        }
    })

    const [propertyColorMap, setPropertyColorMap] = useState(initialColorMap);

    const handleColorChange = (property: string, newColor: ColorMapType) => {
        setPropertyColorMap(prevMap => {
            const newMap = new Map(prevMap);

            newMap.set(property, newColor);

            return newMap;
        });
    };
    const [openDialog, setOpenDialog] = useState(false);

    const handleAddNode = (label: string) => {
    };

    return (
        <SigmaContainer style={sigmaStyle} settings={settings}>
            <ControlsContainer position={"top-left"}>
                <EdgeColorDisplay propertyColorMap={propertyColorMap} onColorChange={handleColorChange}/>
            </ControlsContainer>
            <WikidataGraph nodes={node} edges={edge} propertyColorMap={propertyColorMap}/>
            <GraphEvents setPopup={setPopup}/>
            <ControlsContainer position={"top-right"}>
                <SearchBar style={{width: "200px"}}/>
            </ControlsContainer>
            <ControlsContainer position={"bottom-right"} style={{border: "none", padding: "30px"}}>
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    onClick={() => setOpenDialog(true)}
                >
                    <AddIcon sx={{mr: 1}}/>
                    Add new node
                </Fab>
            </ControlsContainer>
            <Popup nodeInfo={popup}/>
            <AddNodeDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleAddNode}
            />
        </SigmaContainer>
    );
}
