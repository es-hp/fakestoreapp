import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import "./navbar.css";
import { BsList, BsPencilSquare } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { makeTitleCase } from "../utilities/textUtilities";

function NavBar({ uniqueCategories }) {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <Navbar
      bg="none"
      variant="light"
      expand="sm"
      className="d-flex justify-end px-4 py-2 mb-4 border-bottom border-grey border-3"
    >
      <div className="d-flex align-items-center">
        <Navbar.Brand href="/" id="main-logo">
          Shop
        </Navbar.Brand>
        <Dropdown
          show={showCategories}
          onToggle={(isOpen) => setShowCategories(isOpen)}
          title={null}
          align="start"
        >
          <Dropdown.Toggle
            as={Button}
            onClick={() => setShowCategories((prev) => !prev)}
            id="category-toggle"
          >
            <BsList size={30} />
            <p className="ms-2">Categories</p>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu">
            <Dropdown.Item
              className="dropdown-item"
              as={NavLink}
              to={`/products`}
              end
            >
              Shop All
            </Dropdown.Item>
            {uniqueCategories
              .sort((a, b) => a.localeCompare(b)) //sort alphabetically
              .map((category, index) => (
                <Dropdown.Item
                  key={index}
                  className="dropdown-item"
                  as={NavLink}
                  to={`/products/category/${category}`}
                >
                  {makeTitleCase(category)}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <Navbar.Toggle aria-controls="rightside-nav" />
      <Navbar.Collapse id="rightside-nav">
        <Nav className="ms-auto">
          <NavDropdown
            title={
              <span className="d-inline-flex align-items-center text-nowrap me-1">
                <BsPencilSquare size={18} className="me-2" /> Admin Tools
              </span>
            }
            align="end"
            className="text-nowrap"
          >
            <NavDropdown.Item as={NavLink} to="/add-product">
              Add Product
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
