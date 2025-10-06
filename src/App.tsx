import './App.css'
import AuthForm from "@/pages/auth-form.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AddUser from "@/pages/add-user.tsx";
import Header from "@/components/header/Header.tsx";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Header/>}>
          <Route path="login" element={<AuthForm />} />
          <Route path="/" element={<AddUser />} />
        </Route>
    )
);
