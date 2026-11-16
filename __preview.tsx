import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { UserProvider } from "@/provider/UserProvider";
import HotelCard from "@/pages/web/hotel/_components/HotelCard";
import SelectedHotelCard from "@/pages/web/hotel/_components/SelectedHotelCard";
import { SearchPageLoader } from "@/pages/web/hotel/_components/HotelSearchStates";
const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
qc.setQueryData(["hotelInfo", "h1"], { name: "Siam Kempinski Hotel Bangkok", star_rating: 5, images: [], address: "991/9 Rama I Road", region_meta: { name: "Bangkok", country_name: "Thailand" } });
const rate = { room_name: "Deluxe", bedding: [], has_breakfast: true, free_cancellation_before: "2026-12-01", show_amount: "540", show_amount_per_night: "180", show_currency_code: "USD", room_amenities: ["air-conditioning", "wi-fi"] };
const h = (id: string, name: string, stars: number): any => ({ hid: 1, id, name, star_rating: stars, images: [], address: "Sukhumvit Road, Bangkok", region_meta: { name: "Bangkok", country_name: "Thailand" }, rates: [rate] });
const nav = (e: any) => e.preventDefault();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={qc}><UserProvider>
    <div style={{ width: 1180, padding: 24, background: "#fff" }}>
      <p style={{ fontWeight: 700, marginBottom: 8 }}>Loading</p>
      <SearchPageLoader city="Bangkok" />
      <SelectedHotelCard hotel={{ id: "h1", name: "Siam Kempinski" }} data={null} pricePending noRooms={false} nights={3} handleNavigate={nav} />
      <p style={{ fontWeight: 700, margin: "24px 0 8px" }}>Results</p>
      <SelectedHotelCard hotel={{ id: "h1", name: "Siam Kempinski" }} data={h("h1", "Siam Kempinski Hotel Bangkok", 5)} pricePending={false} noRooms={false} nights={3} handleNavigate={nav} />
      <div className="grid grid-cols-4 gap-6">
        {[h("a", "Lebua at State Tower", 5), h("b", "Novotel Siam Square", 4), h("c", "Ibis Sukhumvit 4", 3), h("d", "Hotel Indigo Bangkok", 4)].map((x) => <HotelCard key={x.id} hotel={x} handleNavigate={nav} nights={3} />)}
      </div>
    </div>
  </UserProvider></QueryClientProvider>
);
