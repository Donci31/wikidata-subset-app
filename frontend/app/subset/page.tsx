'use client'

// pages/subsets.js
import {useEffect, useState} from 'react';
import {
    Container,
    Fab,
    Card,
    Grid2,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import {fetchSubsets} from "@/app/subset/lib/data";

interface Subset {
    id: number;
    name: string;
    description: string;
}

export default function SubsetsPage() {
    const [subsets, setSubsets] = useState<Subset[]>([]);

    useEffect(() => {
        fetchSubsets().then((fetchedSubsets) => {
            const subsetsWithDescriptions = fetchedSubsets.map((name, index) => ({
                id: index + 1,
                name: name,
                description: `This is a sample description for ${name}.`
            }));

            setSubsets(subsetsWithDescriptions);
        }).catch((error) => {
            console.error("Error fetching subsets:", error);
        });
    }, []);

    const [openDialog, setOpenDialog] = useState(false);
    const [newSubset, setNewSubset] = useState({ name: '', description: '' });

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
            setSubsets([...subsets, { id: newId, ...newSubset }]);
            setNewSubset({ name: '', description: '' }); // Reset the form
            setOpenDialog(false);
        }
    };

    return (
        <Container sx={{ py: 4, maxWidth: 'lg', minHeight: '80vh' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                Your Subsets
            </Typography>

            {/* Grid Layout using Grid2 */}
            <Grid2 container spacing={3} justifyContent="center">
                {subsets.map((subset) => (
                    <Grid2 key={subset.id}>
                        <Link href={`/subset/${subset.name}`} passHref>
                            <Card
                                sx={{
                                    minHeight: '150px',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                                        {subset.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                        backgroundColor: 'secondary.main',
                    },
                }}
            >
                <AddIcon />
            </Fab>

            {/* Dialog for Creating New Subset */}
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle>Create New Subset</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Subset Name"
                        fullWidth
                        variant="outlined"
                        value={newSubset.name}
                        onChange={(e) => setNewSubset({ ...newSubset, name: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={newSubset.description}
                        onChange={(e) => setNewSubset({ ...newSubset, description: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" variant="outlined">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateSubset} color="primary" variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
