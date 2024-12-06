import {useState} from 'react';
import {Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button} from '@mui/material';


interface CreateSubsetDialogProps {
    open: boolean;
    onClose: () => void;
    onCreate: (label: { name: string; description: string; }) => void;
}


const CreateSubsetDialog = (
    {open, onCreate, onClose}: CreateSubsetDialogProps
) => {
    const [subsetData, setSubsetData] = useState({name: '', description: ''});

    // Reset the form when the dialog is closed
    const handleClose = () => {
        setSubsetData({name: '', description: ''});
        onClose();
    };

    // Handle form submission
    const handleCreate = () => {
        if (subsetData.name && subsetData.description) {
            onCreate(subsetData);
            setSubsetData({name: '', description: ''}); // Reset form fields
            onClose(); // Close the dialog
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create New Subset</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Subset Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={subsetData.name}
                    onChange={(e) => setSubsetData({...subsetData, name: e.target.value})}
                />
                <TextField
                    margin="dense"
                    label="Subset Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={subsetData.description}
                    onChange={(e) => setSubsetData({...subsetData, description: e.target.value})}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreate}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateSubsetDialog;
