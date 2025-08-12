// External Libraries
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// React Bootstrap Components
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";

// Utility functions
import { makeTitleCase } from "../utilities/textUtilities";

function EditProduct({ uniqueCategories, refreshProducts }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productTitle: "",
    price: "",
    description: "",
    category: "",
    customCategory: "",
    image: null,
  });

  // Form interaction states
  const [imagePreview, setImagePreview] = useState(null);
  const [isDirty, setIsDirty] = useState(false); //When user changes something in the form
  const [validated, setValidated] = useState(false);

  // Form submission states
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Delete product states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  // Get product data
  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        const p = response.data;
        setFormData({
          productTitle: p.title || "",
          price: p.price != null ? p.price.toFixed(2) : "",
          description: p.description || "",
          category: p.category || "",
          customCategory: "",
          image: p.image || null,
        });
        setImagePreview(p.image || null);
      })
      .catch((error) => {
        setError(`Failed to fetch product: ${error.message}`);
      });
  }, [id]);

  // Handle form interaction
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setIsDirty(true);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const priceFormat = /^\d*\.?\d{0,2}$/;
    if (value === "" || priceFormat.test(value)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setIsDirty(true);
  };

  const handlePriceBlur = (e) => {
    const { value } = e.target;

    if (value === "") return;

    const convertedToNum = parseFloat(value);

    if (Number.isFinite(convertedToNum)) {
      setFormData((prev) => ({
        ...prev,
        price: convertedToNum.toFixed(2),
      }));
    }
    setIsDirty(true);
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      image: imageURL,
    }));
    setImagePreview(imageURL);
    setIsDirty(true);
  };

  // Unsaved changes prompt (When user tries to reload or close the tab)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; //Default warning for browsers (required for chrome)
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const editProductForm = e.currentTarget;

    if (editProductForm.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        setIsSubmitting(true);

        const categoryToSubmit =
          formData.category === "other"
            ? formData.customCategory
            : formData.category;

        const dataToSubmit = {
          ...formData,
          category: categoryToSubmit,
        };

        const response = await axios.put(
          `https://fakestoreapi.com/products/${id}`,
          dataToSubmit
        );
        console.log(response.data);

        setSubmitted(true);
        setError(null);
        setShowConfirmation(true);

        if (refreshProducts) refreshProducts();

        setTimeout(() => {
          setShowConfirmation(false);
          setValidated(false);
          setSubmitted(false);
          setError(null);
          navigate(`/products/details/${id}`);
        }, 2000);
      } catch (err) {
        setError(`Error submitting form. Please try again: ${err.message}`);
        setSubmitted(false);
      } finally {
        setIsSubmitting(false);
        setIsDirty(false);
      }
    }
    setValidated(true);
  };

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

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column align-items-center py-3 px-4"
      >
        <div
          className="d-flex flex-column align-items-start"
          style={{ width: "100%", minWidth: "300px", maxWidth: "720px" }}
        >
          <h2 className="mb-4">Edit Product</h2>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="d-flex flex-column gap-4 w-100"
          >
            <FloatingLabel controlId="floatingTitle" label="Product Name">
              <Form.Control
                type="text"
                placeholder=""
                name="productTitle"
                value={formData.productTitle}
                onChange={handleChange}
                disabled={isSubmitting}
                required
              />
            </FloatingLabel>
            <Form.Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="p-3"
              disabled={isSubmitting}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {uniqueCategories.map((category, index) => (
                <option key={index} value={category}>
                  {makeTitleCase(category)}
                </option>
              ))}
              <option value="other">Other</option>
            </Form.Select>
            {formData.category === "other" && (
              <FloatingLabel
                controlId="customCategory"
                label="Enter Custom Category"
              >
                <Form.Control
                  type="text"
                  name="customCategory"
                  placeholder="Enter Custom Category"
                  value={formData.customCategory}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </FloatingLabel>
            )}
            <FloatingLabel
              controlId="floatingDescription"
              label="Product Description"
            >
              <Form.Control
                as="textarea"
                maxLength={500}
                placeholder="Product Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                style={{ height: "120px" }}
                disabled={isSubmitting}
                required
              />
              <Form.Text className="d-flex text-muted text-end justify-content-end">
                {formData.description.length}/500
              </Form.Text>
            </FloatingLabel>
            <InputGroup>
              <InputGroup.Text className="p-3">$</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="0.00"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                disabled={isSubmitting}
                required
              />
            </InputGroup>
            <Form.Group controlId="productImage">
              <Form.Label className="text-secondary">
                Upload product image
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImgUpload}
                disabled={isSubmitting}
              />
              <Form.Text className="d-flex text-muted text-end justify-content-end">
                .jpg, .jpeg, .png, .gif, .svg
              </Form.Text>
              {imagePreview && (
                <div className="d-flex justify-content-center">
                  <img
                    src={imagePreview}
                    alt="preview"
                    style={{ maxHeight: "200px", marginTop: "3rem" }}
                  />
                </div>
              )}
            </Form.Group>
            <div className="d-flex gap-4 mt-3 align-self-center">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isSubmitting}
              >
                Delete Product
              </Button>
              <Button variant="warning" type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </div>
          </Form>
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
              Continue to delete <b>{formData.productTitle.trim()}</b>?
            </p>
            <p>This action cannot be undone.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
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
      {submitted && (
        <Modal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          centered
        >
          <Modal.Body>Product updated successfully.</Modal.Body>
        </Modal>
      )}
      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}
    </>
  );
}

export default EditProduct;
