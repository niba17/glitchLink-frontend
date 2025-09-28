import React from "react";
import CreateLinkForm from "@/features/links/components/forms/containers/CreateShortLinkFormContainer";
import { useGuestLinks } from "@/features/links/hooks/useGuestLinks";
import GuestLinksListContainer from "@/features/links/components/lists/containers/GuestLinkListContainer";

export default function Home() {
  const { uiGuestLinks } = useGuestLinks();

  return (
    <main className="min-h-screen bg-zinc-950 px-[145px] py-10">
      <section className="grid grid-cols-2 gap-7">
        <div className="flex flex-col space-y-6">
          <h1 className="text-[50px] leading-[60px] font-semibold">
            In the grid of data, <br /> your link is <br />a{" "}
            <span className="text-[#159976]">weapon</span>
          </h1>
          <h2 className="text-2xl">
            Jack into real-time analytics, <br />
            forge custom-alias links, <br /> take the control
          </h2>
        </div>
        <div className="flex flex-col">
          <CreateLinkForm />
        </div>
      </section>

      {/* Section hanya tampil jika ada guest links */}
      {uiGuestLinks.length > 0 && (
        <section>
          <div className="flex items-center justify-center py-[25px]">
            <div className="flex-grow border-t-[2px]"></div>
            <h2 className="mx-[20px] text-[25px] font-semibold">
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
