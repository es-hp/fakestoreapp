// External Libraries
import axios from "axios";
import { useState, useEffect } from "react";

// React Bootstrap Components
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";

// Utility Functions
import { makeTitleCase } from "../utilities/textUtilities";

function AddProduct({ uniqueCategories, refreshProducts }) {
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

  // Error state
  const [error, setError] = useState(null);

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
        e.returnValue = ""; // Default warning for browsers (required for chrome)
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

    const addProductForm = e.currentTarget;

    if (addProductForm.checkValidity() === false) {
      // If form is not completed correctly...
      e.stopPropagation(); // Prevents other event listeners higher in the DOM tree from triggering other handlers.
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
        const response = await axios.post(
          "https://fakestoreapi.com/products",
          dataToSubmit
        );
        console.log(response.data);
        setSubmitted(true);
        setError(null);
        setShowConfirmation(true);

        if (refreshProducts) refreshProducts();

        setTimeout(() => {
          setShowConfirmation(false);
          setFormData({
            productTitle: "",
            price: "",
            description: "",
            category: "",
            customCategory: "",
            image: null,
          });
          setValidated(false);
          setSubmitted(false);
          setError(null);
        }, 2000);
      } catch (err) {
        setError(`Error submitting form. Please try again: ${err.message}`);
        setSubmitted(false);
      } finally {
        setIsSubmitting(false);
      }
    }
    setValidated(true);
  };

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
          <h2 className="mb-2">Add New Product</h2>
          <p className="text-secondary mb-3">All fields are required.</p>
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
                accept=".jpg, .jpeg, .png, .gif, .svg"
                onChange={handleImgUpload}
                disabled={isSubmitting}
                required
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
            <Button
              variant="warning"
              type="submit"
              className="mt-3 align-self-center"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        </div>
      </Container>
      {submitted && (
        <Modal
          show={showConfirmation}
          onHide={() => setShowConfirmation(false)}
          centered
        >
          <Modal.Body>Product added successfully.</Modal.Body>
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

export default AddProduct;
