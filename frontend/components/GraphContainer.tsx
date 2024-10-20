'use client'

import React, { useState, useMemo } from "react";
import {
    ControlsContainer,
    SigmaContainer,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import NodeType from "@/types/NodeType";
import Popup from "@/components/Popup";
import WikidataGraph from "@/components/WikidataGraph";
import SearchBar from "@/components/SearchBar";
import node from "@/data/node.json";
import edge from "@/data/edge.json";
import EdgeColorDisplay from "@/components/EdgeColorDisplay";
import ColorMapType from "@/types/ColorMapType";
import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddNodeDialog from "@/components/AddNodeDialog";
import GraphEvents from "@/components/GraphEvents";
import debounce from "@/utils/debounce";  // Import debounce utility

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

interface GraphContainerProps {
    sigmaStyle: React.CSSProperties;
    settings: Record<string, boolean>;
}

const GraphContainer: React.FC<GraphContainerProps> = ({ sigmaStyle, settings }) => {

    const [popup, setPopup] = useState<NodeType | null>(null);
    const initialColorMap: Map<string, ColorMapType> = new Map<string, ColorMapType>();

    edge.forEach(edge => {
        const colEdge = initialColorMap.get(edge.property);

        if (colEdge == undefined) {
            const color: ColorMapType = { property: edge.property, color: getRandomColor(), hidden: false };
            initialColorMap.set(edge.property, color);
        }
    });

    const [propertyColorMap, setPropertyColorMap] = useState(initialColorMap);
    const [openDialog, setOpenDialog] = useState(false);

    // Debounce the function that updates the graph
    const debouncedUpdateColor = useMemo(
        () => debounce((property: string, newColor: ColorMapType) => {
            setPropertyColorMap(prevMap => {
                const newMap = new Map(prevMap);
                newMap.set(property, newColor);
                return newMap;
            });
        }, 20), []
    );

    const handleAddNode = () => {
        // TODO
    };

    return (
        <SigmaContainer style={sigmaStyle} settings={settings}>
            <ControlsContainer position={"top-left"}>
                <EdgeColorDisplay
                    propertyColorMap={propertyColorMap}
                    onColorChange={(property, newColor) => debouncedUpdateColor(property, newColor)}
                />
            </ControlsContainer>
            <WikidataGraph nodes={node} edges={edge} propertyColorMap={propertyColorMap} />
            <GraphEvents setPopup={setPopup} />
            <ControlsContainer position={"top-right"}>
                <SearchBar style={{ width: "200px" }} />
            </ControlsContainer>
            <ControlsContainer position={"bottom-right"} style={{ border: "none", padding: "30px" }}>
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    onClick={() => setOpenDialog(true)}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    Add new node
                </Fab>
            </ControlsContainer>
            <Popup nodeInfo={popup} />
            <AddNodeDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleAddNode}
            />
        </SigmaContainer>
    );
};

export default GraphContainer;
