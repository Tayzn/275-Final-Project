/**
 * Temporary data editor
 * merematt@udel.edu & nlago@udel.edu
 * 4/9/2023
 */
import React, { useEffect, useState } from "react";
import { Alert, Button, Modal, Stack, Toast } from "react-bootstrap";
import {
    ProductData,
    ReferencedObject,
    data_HookPromiseState
} from "../../firebase/firebase_data";
import { Product } from "../../interface/product";
import { ProductDisplayComponent } from "./ProductDisplayComponent";
import { ProductFormComponent } from "./ProductFormComponent";
export let array = ["any"];
type propData = {
    category: string;
    isInStock: boolean;
    backorder: boolean;
    currentSearch: string;
    showNoItemsFound: boolean;
    setShowNoItemsFound: (displayNoItemsFound: boolean) => void;
    minprice: string;
    maxprice: string;
};

export function ProductDisplayGrid(props: propData): JSX.Element {
    const [products, setProducts] = useState<ReferencedObject<Product>[]>([]);
    const [loadError, setLoadError] = useState<boolean>(false);
    const [newItem, setNewItem] = useState<boolean>(false);
    const [itemCreateSuccess, setItemCreateSuccess] = useState<boolean>(false);
    const [itemEditSuccess, setItemEditSuccess] = useState<boolean>(false);
    const [itemDeleteSuccess, setItemDeleteSuccess] = useState<boolean>(false);
    // loading data is resource intensive so we should avoid doing it
    useEffect(
        () =>
            data_HookPromiseState(
                ProductData.list(),
                setProducts,
                setLoadError
            ),
        [itemCreateSuccess, itemDeleteSuccess]
    );
    function mapProductCategories() {
        products.map((product) => {
            if (!array.includes(product.data.category)) {
                array = [...array, product.data.category];
            }
        });
    }
    mapProductCategories();
    //this remaps category list if item is deleted
    if (itemDeleteSuccess) {
        array = ["any"];
        mapProductCategories();
    }
    function determineShowProduct(product: ReferencedObject<Product>) {
        //this function just returns a boolean representing if the product in the
        //product mapping meets filter requirements and search.
        if (
            product.data.price <= parseInt(props.maxprice) &&
            product.data.price >= parseInt(props.minprice) &&
            (product.data.name
                .toLowerCase()
                .includes(props.currentSearch.toLowerCase()) ||
                props.currentSearch === "" ||
                product.data.category
                    .toLowerCase()
                    .includes(props.currentSearch.toLowerCase())) &&
            (product.data.category === props.category ||
                props.category === "any") &&
            ((props.isInStock === true && product.data.stock > 0) ||
                (props.backorder === true && product.data.stock <= 0))
        ) {
            if (!props.showNoItemsFound) {
                props.setShowNoItemsFound(true);
            }
            return true;
        }
        return false;
    }

    return (
        <div>
            <Stack direction="vertical" className="m-3">
                <Button onClick={() => setNewItem(true)}>New Item</Button>
                <Toast
                    bg="success"
                    onClose={() => setItemCreateSuccess(false)}
                    show={itemCreateSuccess}
                    delay={5000}
                    autohide
                    className="w-100 my-2"
                >
                    <Toast.Body>Successfully added item</Toast.Body>
                </Toast>
                <Toast
                    bg="success"
                    onClose={() => setItemEditSuccess(false)}
                    show={itemEditSuccess}
                    delay={5000}
                    autohide
                    className="w-100 my-2"
                >
                    <Toast.Body>Successfully edited item</Toast.Body>
                </Toast>
                <Toast
                    bg="success"
                    onClose={() => setItemDeleteSuccess(false)}
                    show={itemDeleteSuccess}
                    delay={5000}
                    autohide
                    className="w-100 my-2"
                >
                    <Toast.Body>Successfully deleted item</Toast.Body>
                </Toast>
            </Stack>
            {loadError ? (
                <Alert variant="danger">Failed to load products</Alert>
            ) : (
                <div className="item-grid">
                    {products[0] !== undefined ? (
                        products.map((product) => {
                            if (determineShowProduct(product)) {
                                return (
                                    <ProductDisplayComponent
                                        key={product.reference.id}
                                        product={product}
                                        admin={true}
                                        deletedDispatcher={setItemDeleteSuccess}
                                        editedDispatcher={setItemEditSuccess}
                                    />
                                );
                            }
                        })
                    ) : (
                        <div>No items to load</div>
                    )}
                </div>
            )}
            <Modal show={newItem} onHide={() => setNewItem(false)}>
                <Modal.Header>
                    <Modal.Title>New Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductFormComponent
                        completedDispatcher={(success) => {
                            setItemCreateSuccess(success);
                            setNewItem(false);
                        }}
                    />
                </Modal.Body>
            </Modal>
            <div
                hidden={props.showNoItemsFound}
                className="NoItemsFoundMessage"
            >
                No Items Found
            </div>
        </div>
    );
}
