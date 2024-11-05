import React, { useState } from "react";
import { IoMdMenu, IoMdSearch } from "react-icons/io";
import { FiUser, FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.jpg";

const NavbarMenu = [
  { id: 1, title: "Accueil", link: "/HomePage" },
  { id: 2, title: "Recettes", link: "/recipes" },
  { id: 3, title: "Repas", link: "/meal-planner" },
  { id: 4, title: "Planificateur", link: "/Planner" },
  { id: 5, title: "Liste Course", link: "/liste-courses" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const iconVariants = {
    hover: { scale: 1.2, rotate: 15, transition: { duration: 0.3 } },
  };

  const logoVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.5,
        rotate: {
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.5,
        },
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 10,
      }
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      }
    },
    exit: { opacity: 0, y: -10 },
  };

  const handleLogout = () => {
    // Supprimer les tokens et les informations de l'utilisateur du localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    // Rediriger l'utilisateur vers la page de connexion
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary fixed top-0 left-0 right-0 z-50 font-poppins">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="container py-4 px-4 flex justify-between items-center"
      >
        {/* Logo section */}
        <div className="flex items-center space-x-3">
          <motion.img
            src={logoImage}
            alt="Ma Cuisine Logo"
            className="h-16 w-auto drop-shadow"
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          />
          <motion.span
            className="font-bold text-2xl text-light"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            MA CUISINE
          </motion.span>
        </div>

        {/* Desktop Menu section */}
        <div className="hidden lg:flex items-center space-x-6">
          <ul className="flex items-center gap-6">
            {NavbarMenu.map((menu) => (
              <li key={menu.id}>
                <Link
                  to={menu.link}
                  className="inline-block py-2 px-4 text-light hover:text-primary relative group transition-colors duration-300"
                >
                  {menu.title}
                  <motion.div
                    className="w-2 h-2 bg-primary absolute mt-2 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  ></motion.div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <motion.button
            variants={iconVariants}
            whileHover="hover"
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-light hover:text-primary transition-colors duration-300"
          >
            <IoMdSearch className="text-2xl" />
          </motion.button>

          <motion.div variants={iconVariants} whileHover="hover">
            <Link to="/preferences" className="text-light hover:text-primary transition-colors duration-300">
              <FiHeart className="text-2xl" />
            </Link>
          </motion.div>

          <div className="relative">
            <motion.button
              variants={iconVariants}
              whileHover="hover"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="text-light hover:text-primary transition-colors duration-300 focus:outline-none"
            >
              <FiUser className="text-2xl" />
            </motion.button>
            {/* User menu dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  <Link
                    to="/back-office" // Changer ici pour aller vers le back-office
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setUserMenuOpen(false);
                      // Ici, vous pouvez ajouter une logique pour récupérer des données utilisateur si nécessaire
                    }}
                  >
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Déconnexion
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Hamburger section */}
        <div className="lg:hidden">
          <motion.button
            variants={iconVariants}
            whileHover="hover"
            onClick={() => setIsOpen(!isOpen)}
            className="text-light focus:outline-none"
            aria-label="Toggle menu"
          >
            <IoMdMenu className="text-4xl" />
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-24 left-0 w-full bg-light z-50"
          >
            <ul className="flex flex-col items-center gap-4 py-6">
              {NavbarMenu.map((menu) => (
                <motion.li
                  key={menu.id}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    to={menu.link}
                    className="text-lg text-secondary hover:text-primary transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {menu.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-0 w-full bg-light shadow-md p-4"
          >
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full p-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
