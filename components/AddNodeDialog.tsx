import React, {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem} from '@mui/material';
import NodeType from "@/types/NodeType";
import EdgeType from "@/types/EdgeType";

interface AddNodeDialogProps {
    open: boolean;
    onClose: () => void;
    onAddNode: (newNode: NodeType, newEdge: EdgeType) => void;
    nodes: NodeType[];
    edges: EdgeType[];
}

const AddNodeDialog = (
    {open, onClose, onAddNode, nodes, edges}: AddNodeDialogProps
) => {
    const [nodeId, setNodeId] = useState('');
    const [label, setLabel] = useState('');
    const [selectedNode, setSelectedNode] = useState('');
    const [selectedEdgeProperty, setSelectedEdgeProperty] = useState('');

    const handleSubmit = () => {
        // Basic validation
        if (!nodeId || !label) {
            alert('Node ID and Label are required');
            return;
        }

        // Prepare node data
        const newNode = {
            id: nodeId,
            label: label,
            description: "",
            aliases: [],
            x: Math.random(), // Random x, y coordinates for example
            y: Math.random(),
        };

        // Prepare edge data if applicable
        const newEdge = {
            src: selectedNode,
            dst: nodeId,
            property: selectedEdgeProperty
        };

        // Call callback with node and optional edge data
        onAddNode(newNode, newEdge);

        // Clear fields and close dialog
        setNodeId('');
        setLabel('');
        setSelectedNode('');
        setSelectedEdgeProperty('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Node</DialogTitle>
            <DialogContent>
                <TextField
                    label="Node ID"
                    value={nodeId}
                    onChange={(e) => setNodeId(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <Select
                    label="Connect to Existing Node"
                    value={selectedNode}
                    onChange={(e) => setSelectedNode(e.target.value)}
                    displayEmpty
                    fullWidth
                    variant={"standard"}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {nodes.map((node) => (
                        <MenuItem key={node.id} value={node.id}>
                            {node.label || node.id}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    label="Edge Property"
                    value={selectedEdgeProperty}
                    onChange={(e) => setSelectedEdgeProperty(e.target.value)}
                    displayEmpty
                    fullWidth
                    variant={"standard"}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {edges.map((edge) => (
                        <MenuItem key={edge.property} value={edge.property}>
                            {edge.property}
                        </MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} color="primary">
                    Add Node
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddNodeDialog;
