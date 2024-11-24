import React, { useState } from "react";
import {ControlsContainer} from "@react-sigma/core";
import {MenuItem, Select, FormControl, InputLabel, SelectChangeEvent} from "@mui/material";
import { useLayoutCircular } from "@react-sigma/layout-circular";
import { useLayoutCirclepack } from "@react-sigma/layout-circlepack";
import { useLayoutForce } from "@react-sigma/layout-force";
import { useLayoutNoverlap } from "@react-sigma/layout-noverlap";
import { useLayoutRandom } from "@react-sigma/layout-random";
import NodeType from "@/types/NodeType";

const LayoutControls = (
    {nodes, setNodes} : {nodes: NodeType[], setNodes: React.Dispatch<React.SetStateAction<NodeType[]>>}
) => {
    const { positions: circularPositions, assign: assignCircular } = useLayoutCircular();
    const { positions: circlePackPositions, assign: assignCirclepack } = useLayoutCirclepack();
    const { positions: forcePositions, assign: assignForce } = useLayoutForce();
    const { positions: noverlapPositions, assign: assignNoverlap } = useLayoutNoverlap();
    const { positions: randomPositions, assign: assignRandom } = useLayoutRandom();

    const [selectedLayout, setSelectedLayout] = useState("circular");

    const handleLayoutChange = (event: SelectChangeEvent) => {
        const layout = event.target.value;
        setSelectedLayout(layout);

        let positions = null;

        switch (layout) {
            case "circular":
                assignCircular();
                positions = circularPositions;
                break;
            case "circlepack":
                assignCirclepack();
                positions = circlePackPositions;
                break;
            case "force":
                assignForce();
                positions = forcePositions;
                break;
            case "noverlap":
                assignNoverlap();
                positions = noverlapPositions;
                break;
            case "random":
                assignRandom();
                positions = randomPositions;
                break;
            default:
                break;
        }

        if (positions !== null) {
            const pos = positions()

            const updatedNodes = nodes.map((node) => ({
                ...node,
                x: pos[node.id].x, // Set new x position
                y: pos[node.id].y  // Set new y position
            }));
            setNodes(updatedNodes);
        }
    };

    return (
        <ControlsContainer position={"bottom-left"} style={{border: "none"}}>
            <FormControl fullWidth variant="outlined" style={{ minWidth: 150 }}>
                <InputLabel>Choose Layout</InputLabel>
                <Select
                    value={selectedLayout}
                    onChange={handleLayoutChange}
                    label="Choose Layout"
                    variant='outlined'
                >
                    <MenuItem value="circular">Circular Layout</MenuItem>
                    <MenuItem value="circlepack">Circlepack Layout</MenuItem>
                    <MenuItem value="force">Force Layout</MenuItem>
                    <MenuItem value="noverlap">Noverlap Layout</MenuItem>
                    <MenuItem value="random">Random Layout</MenuItem>
                </Select>
            </FormControl>
        </ControlsContainer>
    );
};

export default LayoutControls;
