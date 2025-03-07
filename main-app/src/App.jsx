import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./screens/home";
import PdfHome from "./screens/pdfhome";
import Login from "./screens/login";
import SignUp from "./screens/signup";
import UploadQuestions from "./screens/uploadquestions";
import ViewPDF from "./screens/viewpdf";
import UploadQuestionPaper from "./screens/uploadQP";
import LeaderboardQP from "./screens/leaderboardQP";
export default function App(){
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/pdf" element={<PdfHome />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/uploadquestions" element={<UploadQuestions />} />
        <Route path="/viewpdf" element={<ViewPDF />} />
        <Route path="/uploadQP" element={<UploadQuestionPaper />} />
        <Route path="/leaderboard" element={<LeaderboardQP />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}