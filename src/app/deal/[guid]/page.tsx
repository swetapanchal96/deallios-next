// import DealDetail from "./DealDetail";


// // Server-side generateStaticParams function
// export async function generateStaticParams() {
//     try {
//         const response = await fetch("https://getdemo.in/pricecut/api/Front/DealSearch", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({}), // Blank payload as requested
//         });

//         const result = await response.json();

//         // Assuming API returns deals with GUID field in result.data or similar structure
//         const deals = result.data || result.deals || result || [];
// console.log(deals,"dealsdealsdeals")
//         return deals.map((deal: any) => ({
//             guid: deal?.GUID || deal?.GUID,
//         }));
//     } catch (error) {
//         console.error("Error fetching deals for generateStaticParams:", error);
//         return []; // Return empty array if API fails
//     }
// }

// // Default export for the page (Server Component wrapper)
// export default function DealPage({ params }: { params: { guid: string } }) {
//     return <DealDetail guid={params.guid} />;
// }


import axios from "axios";
import DealDetail from "./DealDetail";

export async function generateStaticParams() {
    try {
        const response = await axios.post(
            "https://getdemo.in/pricecut/api/Front/Dealsearch",
            {}, // same empty body as your useEffect
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        const data = response.data?.data;

        if (!Array.isArray(data)) {
            console.log("❌ No deals found from Dealsearch API");
            return [];
        }

        const params = data.map((item: any) => ({
            guid: item?.GUID?.toString(),
        }));

        console.log("✔ Static GUIDs:", params);

        return params;
    } catch (error) {
        console.error("❌ generateStaticParams (axios) failed:", error);
        return [];
    }
}

// Page Component
export default function DealPage({ params }: { params: { guid: string } }) {
    return <DealDetail guid={params.guid} />;
}
