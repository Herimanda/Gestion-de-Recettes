import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const AjoutRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    nom: '',
    description: '',
    instructions: '',
    vegetarien: false,
    categorie: ''
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.size <= 1000000) {  // 1 MB limit
      setImage(file);
    } else {
      alert("L'image dépasse la taille limite de 1 Mo");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.jpeg', '.jpg', '.png', '.gif']},
    maxSize: 1000000  // 1 MB
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({ ...recipeData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setRecipeData({ ...recipeData, [name]: checked });
  };
  const handleSubmit = async () => {
    try {
      // Au lieu d'utiliser FormData, envoyons directement un objet JSON
      const dataToSend = {
        ...recipeData,
        vegetarien: Boolean(recipeData.vegetarien), // Conversion explicite en booléen
      };
  
      // Si une image est présente, la convertir en base64
      if (image) {
        const base64Image = await convertImageToBase64(image);
        dataToSend.image = base64Image;
      }
  
      const response = await axios.post('http://localhost:8000/api/recettes/', dataToSend, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Recette soumise:', response.data);
      navigate('/recipes');
    } catch (error) {
      console.error('Erreur lors de la soumission de la recette:', error);
      alert('Erreur lors de la création de la recette : ' + error.response?.data?.error || error.message);
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleBack = () => {
    navigate('/recipes');
  };

  return (
    <div className="container mx-auto p-8 min-h-screen relative pt-24">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-6"
      >
        Créez votre <span className="text-primary">Recette</span>!
      </motion.h1>

      <motion.form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col">
          <label className="font-semibold mb-2">Nom de la recette</label>
          <input
            type="text"
            name="nom"
            value={recipeData.nom}
            onChange={handleInputChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-2">Catégorie</label>
          <input
            type="text"
            name="categorie"
            value={recipeData.categorie}
            onChange={handleInputChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={recipeData.description}
            onChange={handleInputChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold mb-2">Instructions</label>
          <textarea
            name="instructions"
            value={recipeData.instructions}
            onChange={handleInputChange}
            className="border p-3 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="vegetarien"
            checked={recipeData.vegetarien}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label className="font-semibold">Végétarien</label>
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="font-semibold mb-2">Image de la recette</label>
          <div {...getRootProps()} className={`border-2 border-dashed p-4 text-center ${isDragActive ? 'border-primary' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            {image ? (
              <p>Image sélectionnée: {image.name}</p>
            ) : (
              <p>Glissez et déposez une image ici, ou cliquez pour sélectionner un fichier</p>
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6 md:col-span-2">
          <motion.button
            type="button"
            onClick={handleBack}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            <FaArrowLeft className="mr-2 inline" /> Retour
          </motion.button>
          <motion.button
            type="button"
            onClick={handleSubmit}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
          >
            <FaSave className="mr-2 inline" /> Enregistrer
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default AjoutRecipe;