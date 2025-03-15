import Image from "next/image";

const AboutSectionTwo = () => {
  return (
    <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Image
                src="/images/about/about5.png"
                alt="about image"
                fill
                className="drop-shadow-three dark:hidden dark:drop-shadow-none"
              />
              <Image
                src="/images/about/about5.png"
                alt="about image"
                fill
                className="hidden drop-shadow-three dark:block dark:drop-shadow-none"
              />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
  <div className="max-w-[470px]">
    <div className="mb-9">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
        Share Your Travel Memories
      </h3>
      <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
        Capture and share your travel photos with your friends and other travelers on our platform. 
        Stay connected and relive your best moments.
      </p>
    </div>
    <div className="mb-9">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
        Buy Cultural Souvenirs
      </h3>
      <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
        Explore and buy unique cultural items from different destinations to take home as souvenirs. 
        Experience local traditions through exclusive products.
      </p>
    </div>
    <div className="mb-1">
      <h3 className="mb-4 text-xl font-bold text-black dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
        Book Hotels with Custom Preferences
      </h3>
      <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed">
        Choose your ideal hotel based on your preferences, including AC rooms, general stays, 
        and luxury accommodations to ensure a comfortable trip.
      </p>
    </div>
  </div>
</div>

        </div>
      </div>
    </section>
  );
};

export default AboutSectionTwo;
