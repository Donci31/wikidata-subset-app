'use client'

import {useState, useEffect} from 'react';
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
    Snackbar,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import {fetchSubsets} from "@/app/subset/lib/data";

interface Subset {
    subset_id: string;
    name: string;
    language: string;
}

export default function SubsetsPage() {
    const [subsets, setSubsets] = useState<Subset[]>([]);

    useEffect(() => {
        fetchSubsets()
            .then((fetchedSubsets) => {
                console.log(typeof fetchedSubsets);
                const subsetsWithDescriptions = fetchedSubsets.map(data => ({
                    subset_id: data.subset_id,
                    name: data.name,
                    language: data.language
                }));

                setSubsets(subsetsWithDescriptions);
            })
            .catch((error) => {
                console.error("Error fetching subsets:", error);
            });
    }, []);

    const [openDialog, setOpenDialog] = useState(false);
    const [newSubset, setNewSubset] = useState({
        name: '',
        startingNode: '',
        propertyId: '',
        depth: 5, // Default value
    });
    const [snackbar, setSnackbar] = useState({open: false, message: '', severity: 'success'});

    const handleSnackbarClose = () => {
        setSnackbar({...snackbar, open: false});
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({open: true, message, severity});
    };

    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };

    const handleCreateSubset = async () => {
        const {name, startingNode, propertyId, depth} = newSubset;
        if (name && startingNode && propertyId && depth) {
            try {
                const requestBody = {
                    name,
                    starting_node: startingNode,
                    property_id: propertyId,
                    depth: Number(depth),
                };

                const response = await fetch('http://localhost:3000/api/generate_subset', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    const responseData = await response.json();

                    setSubsets([
                        ...subsets,
                        {
                            subset_id: responseData.subset_id,
                            name: responseData.name,
                            language: responseData.language,
                        },
                    ]);

                    showSnackbar('Subset created successfully!', 'success');
                    setNewSubset({name: '', startingNode: '', propertyId: '', depth: 5});
                    setOpenDialog(false);
                } else {
                    const errorText = await response.text();
                    console.error('Error creating subset:', errorText);
                    showSnackbar('Error creating subset.', 'error');
                }
            } catch (error) {
                console.error('Error creating subset:', error);
                showSnackbar('Error creating subset.', 'error');
            }
        } else {
            showSnackbar('Please fill out all fields.', 'error');
        }
    };

    return (
        <Container sx={{py: 4, maxWidth: 'lg', minHeight: '80vh'}}>
            <Typography variant="h3" component="h1" gutterBottom sx={{fontWeight: 600, textAlign: 'center'}}>
                Your Subsets
            </Typography>

            <Grid2 container spacing={3} justifyContent="center">
                {subsets.map((subset) => (
                    <Grid2 key={subset.subset_id}>
                        <Link href={`/subset/${subset.subset_id}`} passHref>
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
                                    <Typography variant="h6" component="div" sx={{fontWeight: 500}}>
                                        {subset.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mt: 1}}>
                                        {String.fromCodePoint(...subset.language.toUpperCase()
                                            .split('')
                                            .map((char) => 127397 + char.charCodeAt(0)))}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </Grid2>
                ))}
            </Grid2>

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
                <AddIcon/>
            </Fab>

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
                        onChange={(e) => setNewSubset({...newSubset, name: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Starting Node"
                        fullWidth
                        variant="outlined"
                        value={newSubset.startingNode}
                        onChange={(e) => setNewSubset({...newSubset, startingNode: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Property ID"
                        fullWidth
                        variant="outlined"
                        value={newSubset.propertyId}
                        onChange={(e) => setNewSubset({...newSubset, propertyId: e.target.value})}
                    />
                    <TextField
                        margin="dense"
                        label="Depth"
                        fullWidth
                        type="number"
                        variant="outlined"
                        value={newSubset.depth}
                        onChange={(e) => setNewSubset({...newSubset, depth: parseInt(e.target.value, 10) || 5})}
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

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} sx={{width: '100%'}}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
