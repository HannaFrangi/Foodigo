import { Image } from "/src/components/CarouselleSection/Image";
import { Texts } from "/src/components/CarouselleSection/Texts";

export const Carouselle = () => {
  return (
    <section
      id="section"
      className="bg-olive flex flex-col lg:flex-row sm:text-center lg:text-left sm:items-center max-h-3xl h-[50rem] lg:h-[32rem] max-w-7xl pt-12 lg:pt-0 my-14 gap-0 sm:gap-12 lg:gap-0 rounded-3xl lg:mx-auto lg:justify-between"
    >
      <Texts />
      <Image />
    </section>
  );
};
