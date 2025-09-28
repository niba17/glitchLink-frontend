import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Navbar02Container from "@/components/layouts/navbars/navbar-02/containers/Navbar02Container";
import Footer from "@/components/layouts/footers/footer/footer";
import { GuestLinksLoginActionDialogContainer } from "@/features/links/components/dialogs/containers/GuestLinksLoginActionDialogContainer";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar02Container />
      <Component {...pageProps} />
      <Footer />
      <Toaster position="top-right" />

      {/* Mount dialog sekali, store yang mengontrol visibility */}
      <GuestLinksLoginActionDialogContainer />
    </QueryClientProvider>
  );
}
