import React, {CSSProperties, FC} from "react";
import NodeType from "@/types/NodeType";

interface PopupProps {
    nodeInfo: NodeType | null;
}

const Popup: FC<PopupProps> = ({ nodeInfo }: PopupProps) => {
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

export default Popup;
