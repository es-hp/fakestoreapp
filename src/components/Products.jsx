// External libraries
import { Link, useParams } from "react-router-dom";

// React Bootstrap Components
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal utilities and helpers
import { makeTitleCase } from "../utilities/textUtilities";

// Styles
import "./products.css";

function Products({ products, error }) {
  const { category } = useParams();

  // Filtered array of products by category
  const filteredProducts = category
    ? products.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      )
    : products;

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

  return (
    <Container fluid className="px-5">
      <h2 className="mb-4">Products</h2>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active={!category}>
          <Link to="/products">Shop All</Link>
        </Breadcrumb.Item>
        {category && (
          <Breadcrumb.Item active>{makeTitleCase(category)}</Breadcrumb.Item>
        )}
      </Breadcrumb>
      <Row className="row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4">
        {filteredProducts.map((product) => (
          <Col key={product.id} className="mb-5">
            <Link
              to={`/products/details/${product.id}`}
              key={product.id}
              className="link"
            >
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{ objectFit: "contain", height: "350px" }}
                  className="p-4"
                />
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="product-title mb-4">
                      {product.title}
                    </Card.Title>
                    <Card.Text className="product-description mb-4">
                      {product.description}
                    </Card.Text>
                  </div>
                  <Card.Text>
                    <i>${product.price}</i>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;
