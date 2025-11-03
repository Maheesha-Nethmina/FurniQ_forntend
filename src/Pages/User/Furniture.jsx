import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Hero from "../../Components/Hero/Hero";
import FurnitureHeroImage from "../../assets/fur6.jpeg";

function Furniture() {
  return (
    <>
    <Navbar/>
    <Hero
          image={FurnitureHeroImage}
          title={
            <>
              Comfort Meets <span className="text-amber-400">Design </span>
            </>
          }
          subtitle="Discover modern furniture made for your lifestyle."
        />
        
    </>
  )
}

export default Furniture