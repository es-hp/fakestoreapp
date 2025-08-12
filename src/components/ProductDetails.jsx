// External Libraries
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// React Bootstrap Components
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

// Bootstrap Icons
import { BsPencilSquare } from "react-icons/bs";
import { BsTrash3 } from "react-icons/bs";

// Styles
import "./products.css";

function ProductDetails({ products, refreshProducts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // Delete product states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  // Get product data
  useEffect(() => {
    const productFromProps = products.find((p) => String(p.id) === String(id));
    if (productFromProps) {
      setProduct(productFromProps);
    } else {
      axios
        .get(`https://fakestoreapi.com/products/${id}`)
        .then((response) => setProduct(response.data))
        .catch((error) => setError(error.message));
    }
  }, [id, products]);

  // Set and handle quantity input
  const [quantity, setQuantity] = useState(1);

  function increase() {
    setQuantity((prev) => prev + 1);
  }

  function decrease() {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  }

  // Handle manual user quantity input
  function handleChange(e) {
    const value = Math.max(1, Number(e.target.value));
    setQuantity(value);
  }

  // Show popup alert for successfully adding to cart
  const [showAlert, setShowAlert] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setShowAlert(true);
  }

  // Handle delete product
  function handleDelete() {
    setIsDeleting(true);
    axios
      .delete(`https://fakestoreapi.com/products/${id}`)
      .then(() => {
        setShowDeleteModal(false);
        setShowConfirmModal(true);
        if (refreshProducts) refreshProducts();
        setTimeout(() => {
          setShowConfirmModal(false);
          navigate("/products");
        }, 2000);
      })
      .catch((err) => {
        setShowDeleteModal(false);
        alert("Failed to delete product: " + err.message);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  }

  // Error and Loading handling
  if (error)
    return (
      <Container>
        <p className="text-danger">Error: {error}</p>
      </Container>
    );
  if (!product)
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );

  return (
    <Container fluid className="px-4">
      <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center align-items-lg-stretch p-5 gap-5">
        <img
          src={product.image}
          alt={product.title}
          style={{
            objectFit: "contain",
            maxWidth: "500px",
            minWidth: "300px",
            height: "auto",
            aspectRatio: "1/1",
          }}
          className="p-4"
        />
        <div
          className="d-flex flex-column justify-content-between p-5 bg-light rounded-4"
          style={{ maxWidth: "600px" }}
        >
          <div className="d-flex gap-3 align-self-end mb-2">
            <BsTrash3
              onClick={() => setShowDeleteModal(true)}
              size={20}
              className="text-secondary hover-fade cursor-pointer"
              alt="Delete Product"
            />
            <BsPencilSquare
              onClick={() => navigate(`/edit-product/${id}`)}
              size={20}
              className="text-secondary hover-fade cursor-pointer"
              alt="Edit Product"
            />
          </div>
          <h2 className="mb-4">{product.title}</h2>
          <p className="mb-4">{product.description}</p>
          <p className="mb-5 fs-5">
            <i>${product.price}</i>
          </p>
          <Form
            className="d-flex flex-column gap-4 position-relative"
            onSubmit={handleSubmit}
          >
            <ButtonGroup className="align-self-start">
              <Button variant="secondary" onClick={decrease}>
                -
              </Button>
              <Form.Control
                type="number"
                min={1}
                value={quantity}
                onChange={handleChange}
                style={{ textAlign: "center", width: "50px" }}
                aria-label="Quantity"
              ></Form.Control>
              <Button variant="secondary" onClick={increase}>
                +
              </Button>
            </ButtonGroup>
            {showAlert && (
              <ToastContainer
                style={{ position: "absolute", zIndex: 99, top: "-4px" }}
              >
                <Toast
                  onClose={() => setShowAlert(false)}
                  show={showAlert}
                  delay={1500}
                  autohide
                  bg="success"
                >
                  <Toast.Body className="text-white">Added to cart!</Toast.Body>
                </Toast>
              </ToastContainer>
            )}
            <Button
              variant="warning"
              className="align-self-start px-4 py-2"
              type="submit"
            >
              Add to Cart
            </Button>
          </Form>
        </div>
      </div>
      <Modal
        id="delete-product"
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Continue to delete <b>{product.title.trim()}</b>?
          </p>
          <p>This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        id="delete-confirm"
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Body>Product deleted successfully.</Modal.Body>
      </Modal>
    </Container>
  );
}

export default ProductDetails;
