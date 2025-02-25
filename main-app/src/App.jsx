import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/home";
import PdfHome from "./screens/pdfhome";
import Login from "./screens/login";
import SignUp from "./screens/signup";
import UploadQuestions from "./screens/uploadquestions";
import ViewPDF from "./screens/viewpdf";
import { ResponseProvider } from './context/ResponseContext';

export default function App(){
  return (
    <ResponseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/pdf" element={<PdfHome />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/uploadquestions" element={<UploadQuestions />} />
          <Route path="/viewpdf" element={<ViewPDF />} />
        </Routes>
      </BrowserRouter>
    </ResponseProvider>
  )
}