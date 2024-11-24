interface Subset {
    subset_id: string;
    name: string;
    language: string;
}

export async function fetchSubsets(): Promise<Subset[]> {
    const response = await fetch('http://localhost:5000/list_subsets');

    if (response.ok) {
        return await response.json();
    } else {
        return [];
    }
}


export async function fetchSubset(subsetId: string) {
    const response = await fetch(`http://localhost:5000/get_subset/${subsetId}`);

    if (response.ok) {
        return await response.json();
    } else {
        return {};
    }
}
