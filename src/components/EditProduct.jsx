import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import axios from "axios";
import { makeTitleCase } from "../utilities/textUtilities";

function EditProduct({ uniqueCategories, refreshProducts }) {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    productTitle: "",
    price: "",
    description: "",
    category: "",
    customCategory: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products/${id}`)
      .then((response) => {
        const p = response.data;
        setFormData({
          productTitle: p.title || "",
          price: p.price?.toFixed(2) || "",
          description: p.description || "",
          category: p.category || "",
          customCategory: "",
          image: p.image || null,
        });
        setImagePreview(p.image || null);
      })
      .catch((error) => {
        setError(`Failed to fetch product: ${error}`);
      });
  }, [id]);

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
    setImagePreview(URL.createObjectURL(file));
  };

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
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ maxHeight: "200px", marginTop: "1rem" }}
                />
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
