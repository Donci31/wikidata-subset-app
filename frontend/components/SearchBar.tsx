import React, {ChangeEvent, useEffect, useState, CSSProperties} from "react";
import {Attributes} from "graphology-types";
import {getUniqueKey, useCamera, useRegisterEvents, useSigma} from "@react-sigma/core";

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
    style?: CSSProperties;

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
    // Get sigma
    const sigma = useSigma();
    // Get event hook
    const registerEvents = useRegisterEvents();
    // Get camera hook
    const {gotoNode} = useCamera();
    // Search value
    const [search, setSearch] = useState<string>("");
    // Datalist values
    const [values, setValues] = useState<Array<{ id: string; label: string }>>([]);
    // Selected
    const [selected, setSelected] = useState<string | null>(null);
    // random id for the input
    const [inputId, setInputId] = useState<string>("");

    /**
     * When component mount, we set a random input id.
     */
    useEffect(() => {
        setInputId(`search-${getUniqueKey()}`);
    }, []);

    /**
     * When the search input changes, recompute the autocomplete values.
     */
    useEffect(() => {
        const newValues: Array<{ id: string; label: string }> = [];

        sigma.getGraph().forEachNode((key: string): void => {
            sigma.getGraph().setNodeAttribute(key, "highlighted", false);
        });

        if (!selected && search.length > 1) {
            sigma.getGraph().forEachNode((key: string, attributes: Attributes): void => {
                if (attributes.wikidata_label && attributes.wikidata_label.toLowerCase().includes(search.toLowerCase())) {
                    newValues.push({id: key, label: attributes.wikidata_label});
                    sigma.getGraph().setNodeAttribute(key, "highlighted", true);
                }
            });
        }
        setValues(newValues);
    }, [search]);

    /**
     * When use clik on the stage
     *  => reset the selection
     */
    useEffect(() => {
        registerEvents({
            clickStage: () => {
                setSelected(null);
                setSearch("");
            },
        });
    }, [registerEvents]);

    /**
     * When the selected item changes, highlighted the node and center the camera on it.
     */
    useEffect(() => {
        if (!selected) {
            return;
        }

        sigma.getGraph().setNodeAttribute(selected, "highlighted", true);
        gotoNode(selected);

        return () => {
            sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
        };
    }, [selected]);

    /**
     * On change event handler for the search input, to set the state.
     */
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchString = e.target.value;
        const valueItem = values.find((value) => value.label === searchString);
        if (valueItem) {
            setSearch(valueItem.label);
            setValues([]);
            setSelected(valueItem.id);
        } else {
            setSelected(null);
            setSearch(searchString);
        }
    };

    // Common html props for the div
    const htmlProps = {
        className: `react-sigma-search ${className ? className : ""}`,
        id,
        style,
    };

    return (
        <div {...htmlProps}>
            <label htmlFor={inputId} style={{display: "none"}}>
                {labels["text"] || "Search a node"}
            </label>
            <input
                id={inputId}
                type="text"
                placeholder={labels["placeholder"] || "Search..."}
                list={`${inputId}-datalist`}
                value={search}
                onChange={onInputChange}
            />
            <datalist id={`${inputId}-datalist`}>
                {values.map((value: { id: string; label: string }) => (
                    <option key={value.id} value={value.label}>
                        {value.label}
                    </option>
                ))}
            </datalist>
        </div>
    );
};
