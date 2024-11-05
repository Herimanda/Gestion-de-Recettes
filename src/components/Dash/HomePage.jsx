import React from 'react';
import image from '../../assets/image.png';
import blob from '../../assets/Blob.png';
import home from '../../assets/home.webp';
import { motion } from 'framer-motion';
import { FaUtensils, FaAppleAlt, FaShoppingCart } from 'react-icons/fa'; 

export const FadeUp = (delay) => {
  return {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5,
        delay: delay,
        ease: "easeInOut",
      },
    },
  };
};

const HomePage = () => {
  return (
    <section className="bg-light dark:bg-dark w-full min-h-screen pt-20 overflow-x-hidden font-poppins">
      <div className="w-full h-full flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-16">
        {/* Message d'accueil */}
        <div className="flex flex-col justify-center py-8 relative z-20 w-full md:w-1/2 md:h-[calc(90vh-6rem)]">
          <div className="text-center md:text-left space-y-8 max-w-[500px] mx-auto md:mx-0 relative">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              src={blob}
              alt=""
              className="absolute top-0 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-full h-full object-cover z-[-1]"
            />
            <motion.h1
              variants={FadeUp(0.6)}
              initial="initial"
              animate="animate"
              className="text-4xl lg:text-6xl font-bold !leading-tight relative z-10 text-dark dark:text-light tracking-tight"
            >
              Bienvenue sur notre <span className="text-secondary">Site</span>
              <br /> de Gestion de Recettes
            </motion.h1>
          </div>
        </div>
        {/* Image d'accueil */}
        <div className="flex justify-center items-center w-full md:w-1/2 md:h-[calc(90vh-6rem)]">
          <motion.img
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
            src={image}
            alt=""
            className="w-full max-w-[70%] md:max-w-[100%] h-auto object-contain drop-shadow-lg"
          />
        </div>
      </div>
 
      {/* Section avec cartes */}
      <section className="bg-white dark:bg-gray-800 py-24 mt-16">
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          {/* Cartes de fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Carte 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center bg-light dark:bg-dark2 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <FaUtensils className="text-6xl text-secondary mb-6" />
              <h3 className="text-2xl font-bold text-dark dark:text-light mb-4 tracking-wide">Planification de repas personnalisée</h3>
              <p className="text-dark2 dark:text-light text-center text-lg leading-relaxed">
                Des plans de repas spécifiques aux préférences personnelles, aux restrictions alimentaires, à la taille de la famille, au budget et aux objectifs nutritionnels.
              </p>
            </motion.div>

            {/* Carte 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col items-center bg-light dark:bg-dark2 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <FaAppleAlt className="text-6xl text-secondary mb-6" />
              <h3 className="text-2xl font-bold text-dark dark:text-light mb-4 tracking-wide">Recettes développées par des diététiciens</h3>
              <p className="text-dark2 dark:text-light text-center text-lg leading-relaxed">
                Des milliers de recettes délicieuses, développées par des diététiciens, pour garantir une alimentation équilibrée à travers toutes les cuisines.
              </p>
            </motion.div>

            {/* Carte 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col items-center bg-light dark:bg-dark2 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <FaShoppingCart className="text-6xl text-secondary mb-6" />
              <h3 className="text-2xl font-bold text-dark dark:text-light mb-4 tracking-wide">Courses simplifiées</h3>
              <p className="text-dark2 dark:text-light text-center text-lg leading-relaxed">
                Des recettes achetables et des intégrations de livraison d'épicerie pour offrir commodité et simplicité au prix des supermarchés.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nouvelle section avec image et texte */}
      <section className="bg-light dark:bg-dark2 py-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={home}  
              alt="Planification et courses"
              className="w-full max-w-sm md:max-w-[90%] rounded-lg shadow-xl"
            />
          </div>

          {/* Texte */}
          <div className="w-full md:w-1/2 px-6">
            <h3 className="text-3xl font-bold text-dark dark:text-light mb-6 tracking-tight">
              Notre vocation
            </h3>
            <p className="text-xl text-dark2 dark:text-light mb-8 leading-relaxed">
              Vous accompagner pour simplifier chaque étape de votre alimentation.
            </p>
            <div className="space-y-8">
              <div>
                <h4 className="text-2xl font-semibold text-dark dark:text-light mb-3 tracking-wide">
                  Planifiez vos repas pour la semaine
                </h4>
                <p className="text-dark2 dark:text-light text-lg leading-relaxed">
                  Simplifiez la gestion de vos repas avec des plannings hebdomadaires personnalisés, adaptés à votre régime alimentaire, et optimisés pour vos achats d'épicerie.
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-semibold text-dark dark:text-light mb-3 tracking-wide">
                  Gagnez du temps
                </h4>
                <p className="text-dark2 dark:text-light text-lg leading-relaxed">
                  Grâce à la préparation optimisée de vos repas quotidiens, gagnez du temps en réduisant le temps de préparation et en optimisant vos courses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default HomePage;