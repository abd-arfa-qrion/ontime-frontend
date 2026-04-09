import WebsiteLayout from "@/components/layout/WebsiteLayout";
import HomeView from "@/components/view/website/home";

const HomePage = () => {
  return (
    <WebsiteLayout>
      <HomeView />
    </WebsiteLayout>
  );
};
HomePage.metaTitle = "Semua Kebutuhan dalam Satu Aplikasi";
HomePage.metaDescription =
  "rampay menyediakan fitur pembayaran melalui channel bank baik qris dan virtual account untuk mengembangkan bisnis Anda. Dengan fitur integrasi, Anda dapat memanfaatkan teknologi rampay untuk meningkatkan efisiensi operasional dan meningkatkan keuntungan bisnis dari aspek pembayaran tagihan customer Anda.";
export default HomePage;
