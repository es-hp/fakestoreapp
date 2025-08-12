// External Libraries
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// React Bootstrap Components
import Container from "react-bootstrap/Container";

function NotFound() {
  const navigate = useNavigate();

  // Countdown timer state
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <Container>
      <h2>404 Page not found.</h2>
      <p>
        You'll be redirected to the <Link to="/">homepage</Link> in {countdown}.
      </p>
    </Container>
  );
}

export default NotFound;
