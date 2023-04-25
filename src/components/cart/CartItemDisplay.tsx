import React from "react";

import {
    Container,
    Image,
    Col,
    Row,
    Form,
    Button,
    Badge
} from "react-bootstrap";

import {
    CartItem,
    updateCartQuantity,
    removeFromCart
} from "../../interface/cart";

export const CartItemDisplay = ({ item }: { item: CartItem }) => {
    const setQuantity = (newQuantity: number) => {
        if (isNaN(newQuantity)) {
            return;
        }

        if (newQuantity <= 0) {
            removeFromCart(item);
        } else {
            updateCartQuantity(item, newQuantity);
        }
    };

    return (
        <>
            <Container className="d-flex flex-row">
                <Col xs={2}>
                    <Image fluid thumbnail src={item.product.image} />
                </Col>
                <Col className="d-flex flex-row mx-3">
                    <Col xs={10}>
                        <Row className="mb-0 pb-0">
                            <h3 className="mb-0 pb-0">{item.product.name}</h3>
                        </Row>
                        <Row>
                            <Container className="mb-2">
                                <Badge className="me-2" bg="secondary">
                                    Large
                                </Badge>
                                <Badge className="me-2" bg="secondary">
                                    Green
                                </Badge>
                            </Container>
                        </Row>
                    </Col>
                    <Col className="d-flex flex-column align-items-end">
                        <Row className="mb-auto">
                            <h4>${item.product.price * item.quantity}</h4>
                        </Row>
                        <Row>
                            <Container fluid>
                                <h6>Quantity</h6>
                                <Container
                                    fluid
                                    className="d-flex flex-row align-items-end ps-0 pe-0 me-0"
                                >
                                    <Form.Control
                                        type="number"
                                        style={{ width: "65px" }}
                                        value={item.quantity}
                                        onChange={(
                                            e: React.ChangeEvent<HTMLInputElement>
                                        ) =>
                                            setQuantity(
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                    <Button
                                        variant="danger"
                                        className="ms-1"
                                        onClick={() => removeFromCart(item)}
                                    >
                                        X
                                    </Button>
                                </Container>
                            </Container>
                        </Row>
                    </Col>
                </Col>
            </Container>
            <hr></hr>
        </>
    );
};
