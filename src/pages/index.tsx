import React from "react";
import CreateLinkForm from "@/features/links/components/forms/containers/CreateShortLinkFormContainer";
import { useGuestLinks } from "@/features/links/hooks/useGuestLinks";
import GuestLinksListContainer from "@/features/links/components/lists/containers/GuestLinkListContainer";

export default function Home() {
  const { uiGuestLinks } = useGuestLinks();

  return (
    <main className="min-h-screen bg-zinc-950 lg:px-[145px] md:px-5 lg:py-10 md:py-5">
      <section className="grid grid-cols-2 lg:gap-2 md:gap-1">
        <div className="flex flex-col justify-normal lg:space-y-6 md:space-y-3">
          <h1 className="lg:text-[50px] md:text-[50px] lg:leading-[60px] md:leading-[59px] font-semibold">
            In the grid of data, <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </h1>
          <h2 className="lg:text-2xl md:text-xl">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br /> take the control
          </h2>
        </div>
        <div className="flex flex-col mt-1">
          <CreateLinkForm />
        </div>
      </section>

      {/* Section hanya tampil jika ada guest links */}
      {uiGuestLinks.length > 0 && (
        <section>
          <div className="flex items-center justify-center lg:py-[25px] md:py-[20px]">
            <div className="flex-grow border-t-[2px]"></div>
            <h2 className="mx-[20px] lg:text-[25px] md:text-[20px] font-semibold">
              Your Shortened Links
            </h2>
            <div className="flex-grow border-t-[2px]"></div>
          </div>

          <GuestLinksListContainer links={uiGuestLinks} />
        </section>
      )}
    </main>
  );
}
