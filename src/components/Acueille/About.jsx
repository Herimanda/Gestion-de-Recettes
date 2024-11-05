import React from 'react'
import motion from 'framer-motion'

const About = () => {
  return (
    <div className='lg:w-[80%] w-[90%] m-auto py-[60px] flex lg:flex-row flex-col justify-center items-start
    gap-[50px]' id='about'>
      <motion.div
      initial='hiden'
      WhileInview='visible'
      className='lg:w-[60%] w-full flex flex-col justify-center items-start gap-6'>
        <motion.h1 className='text-yellow-500 text-2xl'>
          BIENVENUE A 
        </motion.h1>
        <motion.h1
        className='text-white uppercase text-[40px] font-bold'>
          Site de Gestion de Recette 
        </motion.h1>
        <div className='w-[120px] h-[6px] bg-yellow-500'></div>
        <p className='text-3xl italic text-gray-50 mt-[60px]'>Nos plannings, conçus pour tous les goûts et toutes les contraintes,
        vous guident vers des menus équilibrés et variés, tout au long de la semaine</p>
        
      </motion.div >
     
      <motion.div 
      initial='hidden'
      WhileInview='visible'
      className='lg:w-[40%] w-full flex flex-col justify-center items-start gap-6'>
        <p className='text-white text-lg text-justify'>Nos plannings, conçus pour tous les goûts et toutes les contraintes,
        vous guident vers des menus équilibrés et variés, tout au long de la semaine </p>
        <motion.button
        className='bg-yellow-500 hover:bg-white hover:text-black px-10 py-3 rounded-lg font-bold text-black'>Voir Plus</motion.button>
      </motion.div>
    </div>
  )
}

export default About