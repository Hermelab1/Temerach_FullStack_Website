import React from 'react';
import { uniqueTech } from '../data/uniqueTech'; // Ensure the path is correct
import Heading from '../Home/headings'; // Ensure the path is correct

const icons = [
  'fa-handshake',
  'fa-star',
  'fa-globe',
  'fa-circle-dollar-to-slot',
  'fa-seedling',
  'fa-people-arrows',
];

const Speciality = () => {
  return (
    <section className="bg-gray-100 overflow-hidden flex flex-col items-center justify-center mx-auto z-10">
      <Heading title="Unique Touch" subtitle="Beyond the ordinary" />
      <div className='container mx-auto my-6'>
        {uniqueTech.map((item, index) => {
          const isEvenIndex = index % 2 === 0;

          // Adjust the icon class based on responsiveness
          const iconClass = `fa-solid ${icons[index % icons.length]} mx-[-55px] md:mx-[-20px] border-[2px] border-[#176756] bg-white text-[#176756] text-[1.7rem] item-center text-center py-3 absolute w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full  top-8 ${isEvenIndex ? 'md:right-[-60px] ' : 'md:left-[-60px]'}`;

          // Use different margin/padding for smaller screens and add some space below the icon
          const itemClass = `relative xl:w-[40%] lg:w-[40%] md:w-[43%] w-[80%] opacity-0 flex flex-col items-start mb-2 ${isEvenIndex ? 'animate-move-left ml-[4rem] 2xl:ml-[6%] xl:ml-[5%] lg:ml-[5%] md:ml-[2%]' : 'animate-move-right ml-[4rem] xl:ml-[53%] lg:ml-[55%] md:ml-[55%]'}`;
          
          // Hide the border on smaller devices and only show it on medium and larger devices
          const borderClass = `absolute top-[60px] transform -translate-y-1/2 ${isEvenIndex ? 'right-[-14px] border-l-[15px] border-l-[#176756] border-t-[15px] border-b-[15px] border-transparent' : 'left-[-13px] border-r-[15px] border-r-[#176756] border-t-[15px] border-b-[15px] border-transparent'} md:block hidden`;

          return (
            <div className={itemClass} key={index}>
              <i className={iconClass}></i>
              <div className="bg-white bg-opacity-40 border-2 border-[#176756] rounded-lg shadow-custom p-2 mt-4"> {/* Added mt-4 for margin between icon and text */}
                <h2 className="font-semibold text-center text-xl">{item.title}</h2>
                <p className='text-justify md:leading-[1.7rem] leading-[1.5rem] text-text-lg px-1  lg:px-2 xl:px-4  py-1'>{item.paragraph}</p>
              </div>
              <span className={borderClass}></span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Speciality;