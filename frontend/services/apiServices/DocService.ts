import { filterByPayloadType } from "@/app/documentation/page";
import { api } from "../axios";

interface DocServiceType {
    getDocs(): Promise<any>;
    filter(payload: filterByPayloadType): Promise<any>;
    delete (id: string): Promise<any>;
}

export const DocServices: DocServiceType = {
    getDocs: async() => {
        const res = await api.get("document/get-documents");
        return res.data.allDocuments
    },

    filter: async(payload: filterByPayloadType) => {
        const res = await api.post("document/filter-documents", payload);
        return res.data.docs;
    },

    delete: async(id: string) => {
        const res = await api.delete(`document/delete?documentIdStr=${id}`);
        return res.data.allDocuments;
    }
}