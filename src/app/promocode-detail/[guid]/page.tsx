import axios from "axios";
import PromoCard from "./PromocodeDetail";
import { apiUrl } from "@/config";

export async function generateStaticParams() {
    try {
        const res = await fetch(`${apiUrl}/Front/FrontPromocodelist`, {
            method: "POST",
            body: JSON.stringify({}),
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
        });

        const json = await res.json();
        const data =  json?.data || [];

        return data.map((item: any) => ({
            guid: item.GUID.toString(),
        }));
    } catch (err) {
        console.error("generateStaticParams failed:", err);
        return [];
    }
}


export default async function PromoPage({ params }: { params: Promise<{ guid: string }> }) {
       const { guid } = await params;
    return <PromoCard guid={guid} />;
}
