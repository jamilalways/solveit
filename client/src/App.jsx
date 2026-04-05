import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Explore from './pages/Explore';
import ProblemDetail from './pages/ProblemDetail';
import Dashboard from './pages/Dashboard';
import PostProblem from './pages/PostProblem';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/problem/:id" element={<ProblemDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/post-problem" element={<PostProblem />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
