import React from 'react'
import projet1 from '../../assets/acueille.png'
import projet2 from '../../assets/home.webp'
import projet3 from '../../assets/pasta.jpeg'
import projet4 from '../../assets/salade.jpeg'

const Portfolio = () => {
  return (
    <div id='project' className='w-full'>
        <motion.div 
        initial='hidden'
        WhileInView='visible'
        className='lg:w-[80%] w-[90%] m-auto py-[60px] flex flex-col justify-between items-center gap-[20px]'>
            <motion.h1 
            className='text-yellow-500 text-2xl'>RECETTES</motion.h1>
             <motion.h1 
            className='text-white uppercase text-[40px] font-bold text-center'>Nos meilleurs recettes</motion.h1>
            <motion.div className='w-[120px] h-[6px] bg-yellow-500'></motion.div>
        </motion.div>
        <motion.div
        initial='hidden'
        WhileInView='visible'
        className='w-full m-auto grid lg:grid-cols-4 grid-cols-1'>
     <img src={projet1} alt="projet image" className='h-[250px] w-full'/> 
     <img src={projet2} alt="projet image" className='h-[250px] w-full'/>  
     <img src={projet3} alt="projet image" className='h-[250px] w-full'/>  
     <img src={projet4} alt="projet image" className='h-[250px] w-full'/>  
     <img src={projet1} alt="projet image" className='h-[250px] w-full'/>  
     <img src={projet2} alt="projet image" className='h-[250px] w-full'/>  
     <img src={projet3} alt="projet image" className='h-[250px] w-full'/>  
     <img src={projet4} alt="projet image" className='h-[250px] w-full'/>        
        </motion.div>
    </div>
  )
}

export default Portfolio