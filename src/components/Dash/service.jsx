import React from 'react';
import { motion } from 'framer-motion';
import { FaUtensils, FaBook, FaSeedling } from 'react-icons/fa'; // Importation d'icônes de react-icons

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
      }
    }
  }
}

// Définir les services avec titre, description, et icônes
const services = [
  {
    title: "Recettes de Cuisine",
    description: "Découvrez une variété de recettes pour tous les goûts.",
    icon: <FaUtensils />, // Icône d'ustensiles de cuisine
  },
  {
    title: "Livres de Cuisine",
    description: "Accédez à une bibliothèque de livres de recettes.",
    icon: <FaBook />, // Icône de livre
  },
  {
    title: "Ingrédients Frais",
    description: "Sélection d'ingrédients frais pour vos plats.",
    icon: <FaSeedling />, // Icône de graine (plantes)
  },
];

// Composant qui affiche chaque carte de service
const ServiceCard = ({ title, description, icon, delay }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-dark2 shadow-lg rounded-lg p-6 flex flex-col items-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="text-6xl mb-4 text-secondary">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-light">{description}</p>
    </motion.div>
  );
}

// Section des services
const Service = () => {
  return (
    <section className="py-16 bg-light dark:bg-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 dark:text-light">Nos Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              description={service.description}
              icon={service.icon}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Service;
