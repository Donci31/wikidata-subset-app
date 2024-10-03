import React, {CSSProperties, FC} from "react";
import NodeInfo from "@/types/NodeInfo";

export const Popup: FC<{ nodeInfo: NodeInfo | null }> = ({ nodeInfo }) => {
    if (!nodeInfo) return null;

    const style: CSSProperties = {
        position: "absolute",
        left: nodeInfo.x,
        top: nodeInfo.y,
        padding: "5px 10px",
        backgroundColor: "white",
        border: "1px solid black",
        borderRadius: "5px",
        pointerEvents: "none",
    };

    return (
        <div style={style}>
            <p>{nodeInfo.label}</p>
        </div>
    );
};