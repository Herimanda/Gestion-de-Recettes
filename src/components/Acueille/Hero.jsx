import React from 'react'
import motion from 'framer-motion'
import BackgroundImage from '../../assets/acueille.png'

const Hero = () => {
  return (
    <div id='hero' className='bg-black w-full lg:h-[700px] h-fit m-auto pt-[60px] lg:pt-[0px]
    lg:px-[150px] px-[20px] flex justify-between items-center lg:flex-row flex-col lg:gap-5 gap-[50px]
    bg-cover bg-center' style={{BackgroundImage: url($,{BackgroundImage})}}>
        <motion.div
        initial="hidden"
        whileInView="visible"
        className='lg:w-[60%] w-full flex flex-col justify-center items-start lg:gap-8 gap-4'
        >
            <motion.h1
            className= 'text-yellow-500 text-2xl'>
                Avec Ma Cuisine
            </motion.h1> 
            <motion.h1
            className='text-white uppercase text-[50px] font-bold'>
                Planifiez vos repas hebdomadaires et savourez chaque repas sans vous soucier de la préparation. 
            </motion.h1> 
            <div className='w-[120px] h-[6px] bg-yellow-500'>
                <p className='text-white text-[20px]'> Nos plannings, conçus pour tous les goûts et toutes les contraintes,
                     vous guident vers des menus équilibrés et variés, tout au long de la semaine.</p>
            </div>
        </motion.div>

    </div>
  )
}

export default Hero