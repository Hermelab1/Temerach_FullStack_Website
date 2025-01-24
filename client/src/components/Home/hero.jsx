import React from 'react';
import videobg from '../../asset/video/Movie.mp4';
import Heading from './headings'; // Import Heading component

const Hero = () => {
  return (
    <section className="hero relative w-full md:h-[90vh] h-[100vh]">
      <div className="absolute inset-0">
        <video className="w-full h-full object-cover" src={videobg} autoPlay loop muted></video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div> {/* Adjust opacity here */}
      </div>
      <div className="slogan">
        <Heading title="Every beans tells a story" subtitle="Temerachi Coffee Export" />
      </div>
    </section>
  );
}

export default Hero;