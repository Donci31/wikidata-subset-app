'use client'

import React, {useState, useMemo} from "react";
import {
    ControlsContainer,
    SigmaContainer,
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import NodeType from "@/types/NodeType";
import Popup from "@/components/ItemPopup";
import WikidataGraph from "@/components/WikidataGraph";
import SearchBar from "@/components/SearchBar";
import EdgeColorDisplay from "@/components/EdgeColorDisplay";
import ColorMapType from "@/types/ColorMapType";
import {Fab} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import AddNodeDialog from "@/components/AddNodeDialog";
import GraphEvents from "@/components/GraphEvents";
import debounce from "@/utils/debounce";
import ColorMapManager from "@/utils/ColorMapManager";
import EdgeType from "@/types/EdgeType";
import ItemPopup from "@/components/ItemPopup";  // Import the new class

interface GraphContainerProps {
    node: NodeType[];
    edge: EdgeType[];
    sigmaStyle: React.CSSProperties;
    settings: Record<string, boolean>;
}

const GraphContainer: React.FC<GraphContainerProps> = (
    {node, edge, sigmaStyle, settings}: GraphContainerProps
) => {
    const [nodes, setNodes] = useState<NodeType[]>(node);
    const [edges, setEdges] = useState<EdgeType[]>(edge);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    const colorMapManager = useMemo(() => new ColorMapManager(edge), []);

    const [propertyColorMap, setPropertyColorMap] = useState<Map<string, ColorMapType>>(colorMapManager.getColorMap());
    const [openDialog, setOpenDialog] = useState(false);

    // Debounce the function that updates the graph
    const debouncedUpdateColor = useMemo(
        () => debounce((property: string, newColor: ColorMapType) => {
            colorMapManager.updateColor(property, newColor);
            setPropertyColorMap(new Map(colorMapManager.getColorMap()));
        }, 20), []
    );

    const handleAddNode = (newNode: NodeType, newEdge: EdgeType) => {
        setNodes((prevNodes) => [...prevNodes, newNode]);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
    };

    return (
        <SigmaContainer style={sigmaStyle} settings={settings}>
            <ControlsContainer position={"top-left"}>
                <EdgeColorDisplay
                    propertyColorMap={propertyColorMap}
                    onColorChange={(property, newColor) => debouncedUpdateColor(property, newColor)}
                />
            </ControlsContainer>
            <WikidataGraph nodes={nodes} edges={edges} propertyColorMap={propertyColorMap}/>
            <GraphEvents nodes={nodes} setPopup={setHighlightedId}/>
            <ControlsContainer position={"top-right"}>
                <SearchBar style={{width: "200px"}}/>
                <ItemPopup data={nodes.find(node => node.id === highlightedId) || null}/>
            </ControlsContainer>
            <ControlsContainer position={"bottom-right"} style={{border: "none"}}>
                <Fab
                    variant="extended"
                    color="primary"
                    aria-label="add"
                    sx={{position: 'fixed', bottom: 20, right: 20}}
                    onClick={() => setOpenDialog(true)}
                >
                    <AddIcon sx={{mr: 1}}/>
                    Add new node
                </Fab>
            </ControlsContainer>
            <AddNodeDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAddNode={handleAddNode}
                nodes={nodes}
                edges={edges}
            />
        </SigmaContainer>
    );
};

export default GraphContainer;
