import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bulma/css/bulma.min.css';

const Home = () => <div className="container has-text-centered"><h1 className="title">Home Page</h1></div>;
const Profile = () => <div className="container has-text-centered"><h1 className="title">Profile Page</h1></div>;
const Login = () => <div className="container has-text-centered"><h1 className="title">Login Page</h1></div>;
const Signup = () => <div className="container has-text-centered"><h1 className="title">Sign Up Page</h1></div>;
const Products = () => <div className="container has-text-centered"><h1 className="title">Products Page</h1></div>;
const Categories = () => <div className="container has-text-centered"><h1 className="title">Categories Page</h1></div>;
const Users = () => <div className="container has-text-centered"><h1 className="title">Users Page</h1></div>;
const Analytics = () => <div className="container has-text-centered"><h1 className="title">Analytics Page</h1></div>;

function App() {
  // Simulate authentication status
  const isAuthenticated = false;

  return (
    <Router>
      <section className="hero is-primary is-fullheight">
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <div id="navbarMenuHeroA" className="navbar-menu">
                <div className="navbar-end">
                  <Link to="/" className="navbar-item">Home</Link>
                  {isAuthenticated && <Link to="/profile" className="navbar-item">Profile</Link>}
                  {!isAuthenticated && <Link to="/login" className="navbar-item">Login</Link>}
                  {!isAuthenticated && <Link to="/signup" className="navbar-item">Sign Up</Link>}
                  {isAuthenticated && <Link to="/products" className="navbar-item">Products</Link>}
                  {isAuthenticated && <Link to="/categories" className="navbar-item">Categories</Link>}
                  {isAuthenticated && <Link to="/users" className="navbar-item">Users</Link>}
                  {isAuthenticated && <Link to="/analytics" className="navbar-item">Analytics</Link>}
                </div>
              </div>
            </div>
          </nav>
        </div>

        <div className="hero-body">
          <div className="container has-text-centered">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </div>
        </div>
      </section>
    </Router>
  );
}

export default App;
