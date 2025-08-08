import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import { makeTitleCase } from "../utilities/textUtilities";
import axios from "axios";

function AddProduct({ uniqueCategories, refreshProducts }) {
  const [formData, setFormData] = useState({
    productTitle: "",
    price: "",
    description: "",
    category: "",
    customCategory: "",
    image: null,
  });

  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
  };

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addProductForm = e.currentTarget;

    if (addProductForm.checkValidity() === false) {
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
                accept="image/*"
                onChange={handleImgUpload}
                required
              />
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
