// src/components/AddProductModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";

const AddProductModal = ({ show, handleClose, onSubmit }) => {
  const [productName, setProductName] = useState("");
  const [customProductName, setCustomProductName] = useState("");
  const [specification, setSpecification] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [vendors, setVendors] = useState([{ vendorName: "", vendorPrice: 0 }]);
  const [gst, setGst] = useState(0);
  const [customGst, setCustomGst] = useState("");
  const [remarks, setRemarks] = useState("");

  // State for calculated values
  const [l1Price, setL1Price] = useState(0);
  const [grossValue, setGrossValue] = useState(0);
  const [usdPrice, setUsdPrice] = useState(0);

  // Sample product names and GST options
  const productNames = ["Product A", "Product B", "Product C", "Other"];
  const gstOptions = [0, 5, 12, 18, 28, "Other"];

  // Calculate L1 Price and Gross Value
  useEffect(() => {
    if (vendors.length > 0) {
      const lowestVendor = Math.min(...vendors.map((v) => v.vendorPrice));
      setL1Price(lowestVendor);

      // Calculate GST based on user selection
      const gstValue =
        gst === "Other" ? parseFloat(customGst) : parseFloat(gst);
      const gstAmount = !isNaN(gstValue) ? (lowestVendor * gstValue) / 100 : 0;
      const gross = lowestVendor + gstAmount;

      setGrossValue(gross);
      setUsdPrice((gross / 75).toFixed(2)); // Assuming 75 INR = 1 USD
    }
  }, [vendors, gst, customGst]);

  const handleVendorChange = (index, field, value) => {
    const newVendors = [...vendors];
    newVendors[index][field] = value;
    setVendors(newVendors);
  };

  const addVendor = () => {
    setVendors([...vendors, { vendorName: "", vendorPrice: 0 }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      productName: productName === "Other" ? customProductName : productName,
      specification,
      customerName,
      vendorDetails: vendors,
      L1Price: l1Price,
      GST: gst === "Other" ? customGst : gst,
      grossValue: grossValue,
      usdPrice: usdPrice,
      remarks,
      quantity,
    };
    onSubmit(productData);
    handleClose(); // Close modal after submission
    resetForm();
  };

  const resetForm = () => {
    setProductName("");
    setCustomProductName("");
    setSpecification("");
    setQuantity(0);
    setCustomerName("");
    setVendors([{ vendorName: "", vendorPrice: 0 }]);
    setGst(0);
    setCustomGst("");
    setRemarks("");
    setL1Price(0);
    setGrossValue(0);
    setUsdPrice(0);
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="productName">
            <Form.Label>Product Name</Form.Label>
            <Form.Select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a value
              </option>
              {productNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </Form.Select>
            {productName === "Other" && (
              <Form.Control
                type="text"
                placeholder="Enter custom product name"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                required
              />
            )}
          </Form.Group>

          <Form.Group controlId="specification">
            <Form.Label>Specification</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter specification"
              value={specification}
              onChange={(e) => setSpecification(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="quantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="customerName">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Label>Vendor Details</Form.Label>
          {vendors.map((vendor, index) => (
            <InputGroup className="mb-3" key={index}>
              <Form.Control
                placeholder="Vendor Name"
                value={vendor.vendorName}
                onChange={(e) =>
                  handleVendorChange(index, "vendorName", e.target.value)
                }
                required
              />
              <Form.Control
                type="number"
                placeholder="Vendor Price"
                value={vendor.vendorPrice}
                onChange={(e) =>
                  handleVendorChange(
                    index,
                    "vendorPrice",
                    Number(e.target.value)
                  )
                }
                required
              />
              <Button variant="outline-secondary" onClick={addVendor}>
                Add Vendor
              </Button>
            </InputGroup>
          ))}

          <Form.Group controlId="gst">
            <Form.Label>GST (%)</Form.Label>
            <Form.Select
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a value
              </option>
              {gstOptions.map((gstOption, index) => (
                <option key={index} value={gstOption}>
                  {gstOption}
                </option>
              ))}
            </Form.Select>
            {gst === "Other" && (
              <Form.Control
                type="number"
                placeholder="Enter custom GST value"
                value={customGst}
                onChange={(e) => setCustomGst(e.target.value)}
                required
              />
            )}
          </Form.Group>

          <Form.Group controlId="remarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </Form.Group>

          <div className="mt-3">
            <h5>L1 Price: {l1Price}</h5>
            <h5>Gross Value: {grossValue.toFixed(2)}</h5>
            <h5>USD Price: {usdPrice}</h5>
          </div>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductModal;
