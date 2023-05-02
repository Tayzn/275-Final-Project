import React, { useState, useEffect } from "react";

import {
    Container,
    Table,
    Alert,
    Button,
    Toast,
    ToastContainer,
    Modal
} from "react-bootstrap";

import {
    ProductData,
    ReferencedObject,
    data_HookPromiseState
} from "../../firebase/firebase_data";
import { Product } from "../../interface/product";
import { DocumentReference } from "firebase/firestore";
import { ProductFormComponent } from "../product/ProductFormComponent";

export const AdminInventory = (): JSX.Element => {
    const [products, setProducts] = useState<ReferencedObject<Product>[]>([]);
    const [loadError, setLoadError] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>("");
    const [toastFail, setToastFail] = useState<boolean>(false);
    const [editItem, setEditItem] = useState<boolean>(false);
    const [editProduct, setEditProduct] = useState<ReferencedObject<Product>>();
    const [newItem, setNewItem] = useState<boolean>(false);

    useEffect(() => updateProductDisplay(), []);

    const updateProductDisplay = () => {
        data_HookPromiseState(ProductData.list(), setProducts, setLoadError);
    };

    const deleteItem = (reference: DocumentReference<Product>) => {
        ProductData.delete(reference)
            .then(() => {
                setShowToast(true);
                setToastMessage("Successfully deleted item");
                setToastFail(false);
                updateProductDisplay();
            })
            .catch(() => {
                setShowToast(true);
                setToastMessage("Could not delete item");
                setToastFail(true);
            });
    };

    const editItemOperation = (success: React.SetStateAction<boolean>) => {
        if (success) {
            setShowToast(true);
            setToastMessage("Successfully edited item");
            setToastFail(false);
            updateProductDisplay();
        } else {
            setShowToast(true);
            setToastMessage("Could not edit item");
            setToastFail(true);
        }
        setEditItem(false);
    };

    const newItemOperation = (success: React.SetStateAction<boolean>) => {
        if (success) {
            setShowToast(true);
            setToastMessage("Successfully created a new item");
            setToastFail(false);
            updateProductDisplay();
        } else {
            setShowToast(true);
            setToastMessage("Could not create a new item");
            setToastFail(true);
        }
        setNewItem(false);
    };

    return (
        <Container className="mt-3">
            <div className="d-flex flex-row">
                <h2>Inventory</h2>
                <Button
                    size="lg"
                    className="ms-3 py-0 px-2"
                    onClick={() => setNewItem(true)}
                >
                    Create New Item +
                </Button>
            </div>
            <Table striped className="mt-2">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Modify</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        return (
                            <tr key={product.reference.id}>
                                <td>{product.data.name}</td>
                                <td>{product.data.price}</td>
                                <td>{product.data.stock}</td>
                                <td>
                                    <Button
                                        size="sm"
                                        className="me-2"
                                        onClick={() => {
                                            setEditProduct(product);
                                            setEditItem(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            deleteItem(product.reference)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
            {loadError ? (
                <Alert variant="danger">Failed to load products</Alert>
            ) : (
                <></>
            )}
            <ToastContainer className="my-5 mx-2" position="bottom-end">
                <Toast
                    bg={toastFail ? "danger" : "success"}
                    onClose={() => setShowToast(false)}
                    show={showToast}
                    delay={3000}
                    autohide
                >
                    <Toast.Body>{toastMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Modal show={editItem} onHide={() => setEditItem(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductFormComponent
                        product={editProduct}
                        completedDispatcher={(success) =>
                            editItemOperation(success)
                        }
                    />
                </Modal.Body>
            </Modal>
            <Modal show={newItem} onHide={() => setNewItem(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>New Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductFormComponent
                        completedDispatcher={(success) =>
                            newItemOperation(success)
                        }
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
};
