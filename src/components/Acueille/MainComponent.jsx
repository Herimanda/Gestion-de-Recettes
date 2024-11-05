import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaBars, FaUtensils,FaBalanceScale, FaDollarSign, FaHeart, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom'; // Importer Link pour le routage
import projet1 from '../../assets/acueille.png';
import projet2 from '../../assets/home.webp';
import projet3 from '../../assets/pasta.jpeg';
import projet4 from '../../assets/salade.jpeg';
import mealImage from '../../assets/plan.webp'; // Assurez-vous d'avoir cette image

const FeatureCard = ({ icon, title, description, buttonText, onClick, buttonColor }) => (
    <div className="flex flex-col items-center bg-light dark:bg-dark2 p-6 rounded-lg shadow-md">
        {icon}
        <h3 className="text-xl font-bold text-dark dark:text-light mb-2">{title}</h3>
        <p className="text-dark2 dark:text-light text-center">{description}</p>
        <button
            className={`mt-4 px-4 py-2 rounded-full text-white ${buttonColor}`}
            onClick={onClick}
        >
            {buttonText}
        </button>
    </div>
);

const MainComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => { setIsMenuOpen(!isMenuOpen) };
    const closeMenu = () => { setIsMenuOpen(false) };

    const navItem = [
        { link: 'Home', path: 'hero' },
        { link: 'A Propos', path: 'about' },
        { link: 'Service', path: 'service' },
    ];

    const handleGenererPlanRepas = () => {
        // Logique pour générer le plan de repas
    };

    const equilibrerNutrition = () => {
        // Logique pour équilibrer la nutrition
    };

    const optimiserBudget = () => {
        // Logique pour optimiser le budget
    };

    const ajusterSelonPreferences = () => {
        // Logique pour ajuster selon les préférences
    };

    const varierRepas = () => {
        // Logique pour varier les repas
    };

    return (
        <div>
            {/* Navigation */}
            <nav className='w-full flex bg-white justify-between items-center gap-1 lg:px-16 px-6 py-4 sticky top-0 z-50'>
                <h1 className='text-black md:text-4xl text-3xl font-bold font-rubik'>
                    MA <span className='text-yellow-500 italic'>CUISINE</span>
                </h1>
                <ul className='lg:flex justify-center items-center gap-6 hidden'>
                    {navItem.map(({ link, path }) => (
                        <Link
                            key={path}
                            to={path}
                            className='text-black uppercase font-bold cursor-pointer p-3 rounded-full hover:bg-yellow-500 hover:text-black text-[15]'
                            spy={true}
                            offset={-100}
                            smooth={true}
                        >
                            {link}
                        </Link>
                    ))}
                </ul>
                <RouterLink to="/login">
                    <button className='bg-yellow-500 hover:bg-black hover:text-white text-black px-10 py-3 rounded-full font-semibold transform hover:scale-105 transition-transform duration-300 cursor-pointer md:flex hidden'>
                        SE CONNECTER
                    </button>
                </RouterLink>
                <div className='flex justify-between items-center lg:hidden mt-3' onClick={toggleMenu}>
                    <div>
                        {isMenuOpen ? (
                            <FaTimes className='text-yellow-500 text-3xl cursor-pointer' />
                        ) : (
                            <FaBars className='text-yellow-500 text-3xl cursor-pointer' />
                        )}
                    </div>
                </div>
                <div className={`${isMenuOpen ? 'flex' : 'hidden'} w-full h-fit bg-yellow-500 p-4 absolute top-[72px] left-0`} onClick={closeMenu}>
                    <ul className='flex flex-col justify-center items-center gap-2 w-full'>
                        {navItem.map(({ link, path }) => (
                            <Link
                                key={path}
                                to={path}
                                className='text-black uppercase font-semibold cursor-pointer p-2 rounded-lg hover:bg-black hover:text-white w-full text-center'
                                spy={true}
                                offset={-100}
                                smooth={true}
                            >
                                {link}
                            </Link>
                        ))}
                    </ul>
                </div>
            </nav>



            {/* New Section */}
            <section className="bg-white w-full min-h-screen pt-24 overflow-x-hidden font-poppins">
                <div className="w-full px-4 md:px-8 lg:px-16">
                    {/* Titre et image */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-10">
                        <div className="text-center md:text-left md:w-1/2">
                            <motion.h1 className="text-4xl font-bold mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                                Planifiez vos repas intelligemment avec <span className="text-primary">Ma Cuisine</span>
                            </motion.h1>
                            <p className="text-lg text-dark2">
                                Laissez-nous vous aider à équilibrer nutrition, budget et variété dans vos repas quotidiens.
                            </p>
                        </div>
                        <motion.div className="md:w-1/2 mt-8 md:mt-0" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                            <img src={mealImage} alt="Meal planner" className="w-full h-auto rounded-lg shadow-lg" />
                        </motion.div>
                    </div>
                    {/* Fonctionnalités principales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        <FeatureCard
                            icon={<FaUtensils className="text-4xl text-primary mb-4" />}
                            title="Générer Plan de Repas"
                            description="Créez un plan de repas personnalisé pour la semaine en fonction de vos recettes préférées."
                            buttonText="Générer"
                            onClick={handleGenererPlanRepas}
                            buttonColor="bg-primary hover:bg-primary-dark"
                        />
                        <FeatureCard
                            icon={<FaBalanceScale className="text-4xl text-secondary mb-4" />}
                            title="Équilibrer Nutrition"
                            description="Assurez-vous que chaque repas est équilibré pour répondre à vos besoins nutritionnels."
                            buttonText="Équilibrer"
                            onClick={equilibrerNutrition}
                            buttonColor="bg-secondary hover:bg-secondary-dark"
                        />
                        <FeatureCard
                            icon={<FaDollarSign className="text-4xl text-blue-500 mb-4" />}
                            title="Optimiser le Budget"
                            description="Contrôlez vos dépenses alimentaires tout en profitant de repas délicieux et équilibrés."
                            buttonText="Optimiser"
                            onClick={optimiserBudget}
                            buttonColor="bg-blue-500 hover:bg-blue-600"
                        />
                    </div>
                    {/* Autres options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FeatureCard
                            icon={<FaHeart className="text-4xl text-red-500 mb-4" />}
                            title="Ajuster selon Préférences"
                            description="Modifiez automatiquement votre plan repas pour refléter vos préférences et restrictions alimentaires."
                            buttonText="Ajuster"
                            onClick={ajusterSelonPreferences}
                            buttonColor="bg-red-500 hover:bg-red-600"
                        />
                        <FeatureCard
                            icon={<FaCheckCircle className="text-4xl text-purple-500 mb-4" />}
                            title="Varier les Repas"
                            description="Apportez plus de diversité à vos repas en variant les recettes chaque semaine."
                            buttonText="Varier"
                            onClick={varierRepas}
                            buttonColor="bg-purple-500 hover:bg-purple-600"
                        />
                    </div>
                </div>
            </section>


            {/* Portfolio Section */}
            <div id='project' className='w-full'>
                <motion.div initial='hidden' whileInView='visible' className='lg:w-[80%] w-[90%] m-auto py-[60px] flex flex-col justify-between items-center gap-[20px]'>
                    <motion.h1 className='text-yellow-500 text-2xl'>RECETTES</motion.h1>
                    <motion.h1 className='text-black uppercase text-[40px] font-bold text-center'>Nos Recettes Favoris</motion.h1>
                    <div className='w-[120px] h-[6px] bg-yellow-500'></div>
                </motion.div>
                <motion.div className='w-[80%] m-auto grid md:grid-cols-2 gap-10'>
                    {[projet1, projet2, projet3, projet4].map((projet, index) => (
                        <motion.div
                            key={index}
                            className='relative'
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                        >
                            <img src={projet} alt={`Projet ${index + 1}`} className='w-full h-full rounded-lg shadow-lg' />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

        </div>
    );
};

export default MainComponent;
