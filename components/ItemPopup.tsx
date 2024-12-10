// src/WikidataPopup.js
import React from "react";
import {Typography, List, ListItem, ListItemText, Box, Divider, Chip, Stack} from "@mui/material";
import NodeType from "@/types/NodeType";

const ItemPopup = ({data}: { data: NodeType | null }) => {
    if (!data) return null;

    const renderAliasChips = (aliases: string[]) => {
        return aliases.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap">
                {aliases.map((alias, index) => (
                    <Chip key={index} label={alias}/>
                ))}
            </Stack>
        ) : (
            "No aliases available"
        );
    };

    return (
        <Box p={2} width={300}>
            <Typography variant="h6" gutterBottom>
                {"Q" + data?.id || "No ID"}
            </Typography>

            <Divider/>

            <List>
                <ListItem>
                    <ListItemText primary="Label" secondary={data?.label || "No label available"}/>
                </ListItem>
            </List>

            <ListItem>
                <ListItemText primary="Description" secondary={data?.description || "No description available"}/>
            </ListItem>

            <ListItem>
                <ListItemText primary="Aliases"/>
                {renderAliasChips(data?.aliases || [])}
            </ListItem>
        </Box>
    );
};

export default ItemPopup;
