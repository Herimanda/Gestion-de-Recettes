import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import HomePage from './components/Dash/HomePage';
import RecipeList from './components/Recette/RecipeList';
import Plannificateur from './components/Plannificateur/Plannifcateur';
import Preference from './components/Preference/Preference';
import Repas from './components/Repas/Repas';
import ListeCourse from './components/Course/ListeCoure';  // Assurez-vous que le nom du fichier est correct
import AjoutRecipe from './components/Recette/AjoutRecipePage';
import LoginForm from "./components/Login";
import SignupForm from "./components/Utilisateur/Signup";
import UserDashBoard from './components/Utilisateur/UserDashBoard';
import MainComponent from "./components/Acueille/MainComponent";
import RecipeModal from "./components/Recette/RecipeModal";
import EditRecipeForm from "./components/Recette/EditRecipeForm";

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = /^\/(login|signup)/.test(location.pathname);

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Routes>
        <Route path="/" element={<MainComponent/>} />
        <Route path="/Homepage" element={<HomePage />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/meal-planner" element={<Repas />} />
        <Route path="/planner" element={<Plannificateur />} />
        <Route path="/preferences" element={<Preference />} />
        <Route path="/liste-courses" element={<ListeCourse />} />
        <Route path="/add-recipe" element={<AjoutRecipe />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/back-office" element={<UserDashBoard />} />
        <Route path="/RecipeModal" element={<RecipeModal/>} />
        <Route path="/edit-recipe/:id" element={<EditRecipeForm />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;