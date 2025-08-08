import Container from "react-bootstrap/Container";

function EditProduct() {
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
          <h2>Edit Product</h2>
        </div>
      </Container>
    </>
  );
}

export default EditProduct;
