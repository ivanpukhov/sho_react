import React from 'react';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import './App.scss';
import {useAuth} from "./AuthContext";
import Login from "./Components/Login";
import Register from "./Components/Register";
import FamiliesList from "./Components/FamiliesList";
import FamilyDetails from "./Components/FamilyDetails";
import Header from "./Components/Header/Header";
import Auth from "./Components/Auth";
import CategoriesList from "./Components/CategoriesList";
import ShoppingLists from "./Components/ShoppingLists";
import ShoppingListDetails from "./Components/ShoppingListDetails";

function App() {
    const {isAuthenticated} = useAuth();

    const PrivateRoute = ({ children }) => {
        return isAuthenticated ? children : <Navigate to="/auth" replace />;
    };

    const PublicRoute = ({ children }) => {
        return isAuthenticated ? <Navigate to="/" replace /> : children;
    };

    return (<div className="App">
        <Router>
            <div className="container">
                <Header/>

                <Routes>
                    <Route path="/auth" element={<PublicRoute><Auth/></PublicRoute>}/>
                    <Route path="/login" element={<PublicRoute><Login/></PublicRoute>}/>
                    <Route path="/register" element={<PublicRoute><Register/></PublicRoute>}/>

                    <Route path="/" element={<PrivateRoute><FamiliesList/></PrivateRoute>}/>
                    <Route path="/profile" element={<PrivateRoute><FamiliesList/></PrivateRoute>}/>
                    <Route path="/categories" element={<PrivateRoute><CategoriesList/></PrivateRoute>}/>
                    <Route path="/list" element={<PrivateRoute><ShoppingLists/></PrivateRoute>}/>
                    <Route path="/shoppingLists/:id" element={<PrivateRoute><ShoppingListDetails/></PrivateRoute>}/>
                    <Route path="/categories/:categoryId" element={<PrivateRoute><CategoriesList/></PrivateRoute>}/>
                    <Route path="/family/:familyId" element={<PrivateRoute><FamilyDetails/></PrivateRoute>}/>
                </Routes>
            </div>
        </Router>
    </div>);
}

export default App;
