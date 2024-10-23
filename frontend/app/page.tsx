'use client'

// pages/subsets.js
import {useState} from 'react';
import {
    Container,
    Fab,
    Card,
    Grid2,
    CardContent,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import CreateSubsetDialog from "@/components/CreateSubsetDialog"; // Import the Next.js router

export default function SubsetsPage() {
    const [subsets, setSubsets] = useState([
        {id: 1, name: "Sample Subset 1", description: "This is a sample description for subset 1."},
        {id: 2, name: "Sample Subset 2", description: "This is a sample description for subset 2."},
    ]);

    const [openDialog, setOpenDialog] = useState(false);
    const [newSubset, setNewSubset] = useState({name: '', description: ''});

    // Handle opening the dialog
    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    // Handle closing the dialog
    const handleClose = () => {
        setOpenDialog(false);
    };

    // Handle form submission
    const handleCreateSubset = () => {
        if (newSubset.name && newSubset.description) {
            const newId = subsets.length + 1; // Assign a new ID to the subset
            setSubsets([...subsets, {id: newId, ...newSubset}]);
            setNewSubset({name: '', description: ''}); // Reset the form
            setOpenDialog(false);
        }
    };

    return (
        <Container>
            <h1>Your Subsets</h1>

            {/* Grid Layout using Grid2 */}
            <Grid2 container spacing={3}>
                {subsets.map((subset) => (
                    <Grid2 key={subset.id}>
                        <Link href={`/subset/${subset.id}`}>
                            <Card sx={{minHeight: '150px', cursor: 'pointer'}}>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {subset.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {subset.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid2>
                ))}
            </Grid2>

            {/* Floating Action Button (FAB) */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleClickOpen}
                sx={{position: 'fixed', bottom: 20, right: 20}}
            >
                <AddIcon/>
            </Fab>

            {/* Dialog for Creating New Subset */}
            <CreateSubsetDialog
                open={openDialog}
                onCreate={handleCreateSubset}
                onClose={handleClose}
            />
        </Container>
    );
}
