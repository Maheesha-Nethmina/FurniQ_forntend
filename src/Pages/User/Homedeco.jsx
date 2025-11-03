import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Hero from "../../Components/Hero/Hero";
import homedecoHeroImage from "../../assets/fur7.jpeg";

function Homedeco() {
  return (
    <>
    <Navbar/>
       <Hero
          image={homedecoHeroImage}
          title={
            <>
              Bring Life to  <span className="text-amber-400">Every Space </span>
            </>
          }
          subtitle="Discover charming décor pieces that make your house feel like home."
        />
    </>
  )
}

export default Homedeco