import React, {useState} from "react";
import ColorMapType from "@/types/ColorMapType";
import {
    Box,
    Typography,
    Checkbox,
    Tooltip,
    FormControlLabel,
    List,
    ListItem,
    Collapse,
    IconButton
} from "@mui/material";
import {ExpandMore, ExpandLess} from '@mui/icons-material'; // Icons for expand/collapse

interface EdgeColorDisplayProps {
    propertyColorMap: Map<string, ColorMapType>;
    onColorChange: (property: string, newColor: ColorMapType) => void;
}

const EdgeColorDisplay: React.FC<EdgeColorDisplayProps> = (
    {propertyColorMap, onColorChange}: EdgeColorDisplayProps
) => {
    const [isListOpen, setIsListOpen] = useState(false); // Track whether the list is open or closed

    return (
        <Box p={4} boxShadow={3} borderRadius={2} bgcolor="background.paper">
            {/* Header with toggle functionality */}
            <Box display="flex" justifyContent="space-between" alignItems="center"
                 onClick={() => setIsListOpen(!isListOpen)} sx={{cursor: 'pointer'}}>
                <Typography variant="h5" gutterBottom>
                    Properties
                </Typography>
                <IconButton>
                    {isListOpen ? <ExpandLess/> : <ExpandMore/>} {/* Change icon based on open/closed state */}
                </IconButton>
            </Box>

            {/* Collapsible List */}
            <Collapse in={isListOpen}>
                <Box maxHeight="500px" overflow="auto" border={1} borderColor="grey.300" borderRadius={2} p={2}>
                    <List>
                        {Array.from(propertyColorMap.entries()).map(([property, color], index) => (
                            <ListItem
                                key={index}
                                sx={{
                                    position: 'relative',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: color.color, // Use the selected color for the background
                                    cursor: 'pointer',
                                    '&:hover': {
                                        boxShadow: 4,
                                        opacity: 0.9,
                                    }
                                }}
                            >
                                {/* Property Name */}
                                <Typography variant="body1" fontWeight="bold" color="textPrimary">
                                    {property}
                                </Typography>

                                {/* Color Picker (Visible but covered by card) */}
                                <Box
                                    component="input"
                                    type="color"
                                    value={color.color}
                                    onChange={(e) => {
                                        color.color = e.target.value;
                                        onColorChange(property, color);
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,  // Hidden but clickable
                                        cursor: 'pointer',
                                    }}
                                />

                                {/* Hidden Checkbox with Tooltip */}
                                <Tooltip title={color.hidden ? "Show this property" : "Hide this property"} arrow>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={color.hidden}
                                                onChange={(e) => {
                                                    color.hidden = e.target.checked;
                                                    onColorChange(property, color);
                                                }}
                                                sx={{
                                                    color: color.hidden ? "primary.main" : "default",
                                                }}
                                                onClick={(e) => e.stopPropagation()} // Prevent triggering the color picker when clicking the checkbox
                                            />
                                        }
                                        label="Hidden"
                                        sx={{ml: 2}}
                                    />
                                </Tooltip>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Collapse>
        </Box>
    );
};

export default EdgeColorDisplay;
