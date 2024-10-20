import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from "@mui/material";

interface AddNodeDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (label: string) => void;
}

export default function AddNodeDialog({ open, onClose, onSubmit }: AddNodeDialogProps) {
    const [nodeLabel, setNodeLabel] = useState("");

    const handleSubmit = () => {
        if (nodeLabel) {
            onSubmit(nodeLabel);  // Pass the label to the parent component
            setNodeLabel("");  // Clear input
            onClose();  // Close the dialog
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Node</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter the label for the new node you want to add to the graph.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Node Label"
                    type="text"
                    fullWidth
                    value={nodeLabel}
                    onChange={(e) => setNodeLabel(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Add</Button>
            </DialogActions>
        </Dialog>
    );
}
