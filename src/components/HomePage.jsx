// External Libraries
import { Link } from "react-router-dom";

// React Bootstrap Components
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

// Styles
import "./homepage.css";

function HomePage({ products, error }) {
  // Error and loading handling
  if (error) {
    return (
      <Container>
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container>
        <p>Loading products...</p>
      </Container>
    );
  }

  // Get featured product
  const featuredProduct = products[2];

  return (
    <Container fluid className="px-4" style={{ maxWidth: "1400px" }}>
      <Card
        id="featured-product-card"
        className="d-flex flex-column-reverse flex-md-row"
      >
        <div
          id="featured-text"
          className="p-4 d-flex flex-column"
          style={{ flex: "1" }}
        >
          <Card.Body className="d-flex flex-column justify-content-center">
            <Card.Title>
              <h2>{featuredProduct.title}</h2>
            </Card.Title>
            <Card.Text className="mt-3">
              {featuredProduct.description}
            </Card.Text>
            <Button
              as={Link}
              to="/products"
              variant="warning"
              className="mt-5 align-self-start fs-5"
            >
              Shop now
            </Button>
          </Card.Body>
        </div>
        <div style={{ flex: "1" }}>
          <Card.Img
            src={featuredProduct.image}
            alt=""
            className="h-100"
            style={{
              objectFit: "contain",
              padding: "2rem",
              maxHeight: "500px",
            }}
          />
        </div>
      </Card>
    </Container>
  );
}

export default HomePage;
