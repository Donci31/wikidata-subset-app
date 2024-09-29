import {DisplayGraph} from "@/components/DisplayGraph";

export default function Home() {
    const sigmaStyle = { height: "770px", width: "1920px" }

    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <DisplayGraph style={sigmaStyle}></DisplayGraph>
        </main>
    );
}
