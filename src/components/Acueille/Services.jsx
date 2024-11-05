import React from 'react'
import { motion } from 'framer-motion';
import { FaUtensils, FaAppleAlt, FaShoppingCart } from 'react-icons/fa'; 

const Services = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* Carte 1 */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex flex-col items-center bg-light dark:bg-dark2 p-6 rounded-lg shadow-md"
    >
      <FaUtensils className="text-5xl text-secondary mb-4" />
      <h3 className="text-xl font-bold text-dark dark:text-light mb-2">Planification de repas personnalisée</h3>
      <p className="text-dark2 dark:text-light text-center">
        Des plans de repas spécifiques aux préférences personnelles, aux restrictions alimentaires, à la taille de la famille, au budget et aux objectifs nutritionnels.
      </p>
    </motion.div>

    {/* Carte 2 */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex flex-col items-center bg-light dark:bg-dark2 p-6 rounded-lg shadow-md"
    >
      <FaAppleAlt className="text-5xl text-secondary mb-4" />
      <h3 className="text-xl font-bold text-dark dark:text-light mb-2">Recettes développées par des diététiciens</h3>
      <p className="text-dark2 dark:text-light text-center">
        Des milliers de recettes délicieuses, développées par des diététiciens, pour garantir une alimentation équilibrée à travers toutes les cuisines.
      </p>
    </motion.div>

    {/* Carte 3 */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="flex flex-col items-center bg-light dark:bg-dark2 p-6 rounded-lg shadow-md"
    >
      <FaShoppingCart className="text-5xl text-secondary mb-4" />
      <h3 className="text-xl font-bold text-dark dark:text-light mb-2">Courses simplifiées</h3>
      <p className="text-dark2 dark:text-light text-center">
        Des recettes achetables et des intégrations de livraison d'épicerie pour offrir commodité et simplicité au prix des supermarchés.
      </p>
    </motion.div>
  </div>

  )
}

export default Services