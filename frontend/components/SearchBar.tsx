import React, {ChangeEvent, useState} from "react";
import {Attributes} from "graphology-types";
import {useCamera, useSigma} from "@react-sigma/core";
import {Box, TextField, Autocomplete} from "@mui/material";

type SearchLabelKeys = "text" | "placeholder";

export interface SearchControlProps {
    /**
     * HTML id
     */
    id?: string;

    /**
     * HTML class
     */
    className?: string;

    /**
     * HTML CSS style
     */
    style?: React.CSSProperties;

    /**
     * Map of the labels we use in the component.
     * This is useful for I18N
     */
    labels?: { [Key in SearchLabelKeys]?: string };
}

export const SearchBar: React.FC<SearchControlProps> = (
    {
        id,
        className,
        style,
        labels = {},
    }: SearchControlProps
) => {

    const sigma = useSigma();

    const [search] = useState<string>("");

    const {gotoNode} = useCamera();

    const [values, setValues] = useState<Array<{ id: string; label: string }>>([]);

    // Handle input change and selection
    const handleInputChange = (event: ChangeEvent<object>, newValue: string | null) => {
        const newValues: Array<{ id: string; label: string }> = [];

        let exactMatch = false;

        sigma.getGraph().forEachNode((key: string, attributes: Attributes): void => {
            if (newValue && attributes.wikidata_label && attributes.wikidata_label.toLowerCase() == newValue.toLowerCase()) {
                sigma.getGraph().setNodeAttribute(key, "highlighted", true);
                gotoNode(key)
                exactMatch = true;
            } else {
                sigma.getGraph().setNodeAttribute(key, "highlighted", false);
            }
        });

        if (exactMatch) {
            setValues([]);
            return;
        }

        if (newValue && newValue.length > 1) {
            sigma.getGraph().forEachNode((key: string, attributes: Attributes): void => {
                if (attributes.wikidata_label && attributes.wikidata_label.toLowerCase().includes(newValue.toLowerCase())) {
                    newValues.push({id: key, label: attributes.wikidata_label});
                    sigma.getGraph().setNodeAttribute(key, "highlighted", true);
                }
            });
        }
        setValues(newValues);
    };

    // Common HTML props for the wrapper div
    const htmlProps = {
        className: `react-sigma-search ${className || ""}`,
        id,
        style,
    };

    return (
        <Box {...htmlProps}>
            {/* Material-UI Autocomplete */}
            <Autocomplete
                freeSolo
                disableClearable
                options={values.map((option) => option.label)}
                value={search}
                onInputChange={handleInputChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={labels["text"] || "Search a node"}
                        placeholder={labels["placeholder"] || "Search..."}
                        variant="outlined"
                        fullWidth
                    />
                )}
            />
        </Box>
    );
};
