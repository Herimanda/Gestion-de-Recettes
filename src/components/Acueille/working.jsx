import React from 'react'
import { motion } from 'framer-motion';
import { FaUtensils, FaAppleAlt, FaShoppingCart } from 'react-icons/fa'; 
import home from '../../assets/home.webp';

const working = () => {
  return (
    <section className="bg-light dark:bg-dark2 py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center mb-8 md:mb-0">
            <img
              src={home}  
              alt="Planification et courses"
              className="w-full max-w-sm md:max-w-full"
            />
          </div>

          {/* Texte */}
          <div className="w-full md:w-1/2 px-4">
            <h3 className="text-2xl font-bold text-dark dark:text-light mb-4">
              Notre vocation
            </h3>
            <p className="text-lg text-dark2 dark:text-light mb-4">
              Vous accompagner pour simplifier chaque étape de votre alimentation.
            </p>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-dark dark:text-light">
                  Planifiez vos repas pour la semaine
                </h4>
                <p className="text-dark2 dark:text-light">
                  Simplifiez la gestion de vos repas avec des plannings hebdomadaires personnalisés, adaptés à votre régime alimentaire, et optimisés pour vos achats d'épicerie.
                </p>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-dark dark:text-light">
                  Gagnez du temps
                </h4>
                <p className="text-dark2 dark:text-light">
                  Grâce à la préparation optimisée de vos repas quotidiens, gagnez du temps en réduisant le temps de préparation et en optimisant vos courses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}

export default working