# Coding Temple SE Assignment: FakeStoreApp [Helen Park]

To create a FakeStore E-Commerce App using React, React Router, and FakeStoreAPI for testing CRUD.

## App.jsx

- Uses axios to fetch product data from fakestoreapi.
- Creates a new array with product categories from api without repeats.
- Multiple pages created using Routes and passes the fetched data to components

## NavBar.jsx

- Uses Navbar from React Bootstrap.
  - React Bootstrap Dropdown used with Bootstrap Icon for navigating to products by category.
    - Uses custom 'makeTitleCase();' utility hook to transform category names.
  - Uses Navbar.Toggle and Collapse to make second dropdown responsive to screen size.

## HomePage.jsx

- React Bootstrap Card component used to create a featured product section with data being brought in from App.jsx.
- Links to Products page using 'Link' from React Router.

## NotFound.jsx

- Simple 404 error page that redirects to HomePage.jsx after 10 second countdown.

## Products.jsx

- Page to display a list of products, which can be filtered by category.

### Breadcrumb nav

- Uses React Bootstrap Breadcrumb component to help users understand their location.
  - 'Shop all' marked active if no category is selected.

### Product grid

- Product grid created using React Bootcamp's Row and Col component that is responsive to screen size.
  - Product array (filtered by category when category is selected) mapped over Bootstrap's Card component to show product data (Title, image, description, price) that links to its respective product details page.
  - Created a product-title and product-description class to limit the number of lines of text (and show ellipses for longer text) using css (products.css).

## ProductDetails.jsx

- Responsive flexbox divs containing product data for product that matches the id from the URL.
- There are icons for handling 'Delete Product' and navigating to 'Edit Product'.

### Deleting product

- Delete button/icon triggers showing React Bootstrap's Modal component, which asks user confirmation to delete.
- Cancel button will hide Modal.
- Delete button will trigger handleDelete function, which calls API to delete item using Axios.
  - It will also refresh the products (trigger function in App.jsx via props).
  - It will show a success message modal, which disappears with setTimeout after 2 seconds.
  - Then it will automatically navigate back to the products page.

### Edit product quantity

- Uses React Bootstrap Form and ButtonGroup to create a quantity input with default value as 1.
- Has an increase and decrease button linked to increase and decrease functions.
- Handles manual user input using change in quantity state, but making sure only numbers 1 or greater can be input.

#### 'Add to Cart' submit

- Shows a small popup success notification using React Bootstrap's Toast and ToastContainer components. Auto hides after 1.5 seconds.

## AddProduct.jsx

- Uses React Bootstrap's Form, InputGroup, FloatingLabel components to create a form to add new product.
- Uses 'handleChange' and similar functions to change the formData's state and fills empty form based on user interaction.
  - Any changes made to inputs will also set isDirty state to true.
    - If isDirty state is true, it will trigger an alert stating 'there are unsaved changes, continue to leave?' warning when user tries to refresh or close window using 'beforeunload' event listener.
- 'handlePriceChange' function will make sure input follows format (limits decimal to max 2 places).
- 'handlePriceBlur' will auto format number that was input to have 2 decimal places when user clicks out of input.
- 'handleImgUpload' will turn uploaded file into a URL, and show a preview of the image.
- 'uniqueCategories' mapped over the Form.Select option.
  - Text transformed using custom text utility function 'makeTitleCase'.
- If the category from the dropdown is set to 'other' a new input will show where user can type in a new category.

### Handle form submission function

- Stops default form submission behavior and propagation.
- Uses Bootstrap's form validation.
- Sets submission set to true, and inputs are disabled when true so that user can't make changes when it's in the process of submitting.
- If a custom category is entered, it will update the category input to custom input.
- Submits new data to API using axios.post
- Shows confirmation Modal and hides after 2 seconds using setTimeout.
- Refresh the products (trigger function in App.jsx via props).
- Resets form to empty input state.

## EditProduct.jsx

- Very similar to AddProducts.jsx form.
- Starts with data already filled. Data fetched using axios.get
- Delete button will show 'confirm delete Modal'
  - Delete product using axios.delete
  - Refreshes (Re-fetches updated data from API) using function on App.jsx using refreshProducts prop.
