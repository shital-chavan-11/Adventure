import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Page | Free Next.js Template for Startup and SaaS",
  description: "This is About Page for Startup Nextjs Template",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="About Adventure"
        description="Adventure is your ultimate tourism platform, providing everything you need for an unforgettable journey. From booking hotels to discovering cultural experiences, we make travel seamless and exciting."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
    </>
  );
};


export default AboutPage;
