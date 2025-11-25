import { useQuery } from "@tanstack/react-query";
import { useBaseUrl } from "../BaseUrlContext";

export function useDataSet(path: string, enabled: boolean = true) {
    const franchiseUrl = useBaseUrl(path);
    return useQuery({
        queryKey: [franchiseUrl], queryFn: () => {
            return fetch(franchiseUrl).then(res => res.json());
        }, enabled: enabled
    });
}

export default useDataSet;