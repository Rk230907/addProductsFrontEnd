// src/components/Home.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import {
  Container,
  Row,
  Col,
  Table,
  InputGroup,
  FormControl,
  Button,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import AddProductModal from "./AddProductModal"; // Import the modal component

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Fetch top products on component mount
  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "https://addproducts.onrender.com/products/top"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching top products:", error);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    if (searchTerm) {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://addproducts.onrender.com/products/search?productName=${searchTerm}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error searching products:", error);
        setError("Failed to find products.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to export data to Excel
  const exportToExcel = async () => {
    try {
      const response = await axios.get(
        "https://addproducts.onrender.com/products"
      );
      const data = response.data;
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
      XLSX.writeFile(workbook, "products.xlsx");
    } catch (error) {
      console.error("Error exporting data:", error);
      setError("Failed to export data.");
    }
  };

  // Function to handle adding new product
  const handleAddProduct = async (newProduct) => {
    try {
      await axios.post("http://localhost:5001/products", newProduct);
      fetchTopProducts(); // Refresh the product list
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-primary">Top Products</h2>
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <FormControl
              placeholder="Search by Product Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </InputGroup>
        </Col>
        <Col md={4}>
          <Button variant="success" onClick={exportToExcel} className="w-100">
            Export to Excel
          </Button>
        </Col>
      </Row>

      {loading && (
        <div className="text-center mb-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-4"
      >
        Add Product
      </Button>

      <Table striped bordered hover className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Specification</th>
            <th>Customer Name</th>
            <th>L1 Price</th>
            <th>GST</th>
            <th>Gross Value</th>
            <th>USD Price</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{product.productName}</td>
              <td>{product.specification}</td>
              <td>{product.customerName}</td>
              <td>{product.L1Price}</td>
              <td>{product.GST}</td>
              <td>{product.grossValue}</td>
              <td>{product.usdPrice}</td>
              <td>{product.remarks}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Product Modal */}
      <AddProductModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        onSubmit={handleAddProduct}
      />
    </Container>
  );
};

export default Home;
