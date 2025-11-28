import Image from "next/image";
import styles from "./page.module.css";
import Offers from "./components/offer";
import TopStores from "./components/home_top_stores";
import CouponsSlider from "./components/home_coupon";
import OffersBottom from "./components/offer_bottom";

export default function Home() {
  return (
    <div >
      <section className="main-bg">

      
      <Offers />
      <TopStores />
      <CouponsSlider />
      <OffersBottom />
      </section>
    </div>
  );
}
