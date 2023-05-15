import React, { useState } from "react";
import { Container, Button, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { BasicDisplayCard } from "../components/cart/BasicDisplayCard";
import { CartItem } from "../interface/cart";
import { Order, useOrder } from "../interface/order";
import { ReferencedObject } from "../firebase/firebase_data";

export const ConfirmationPage = (): JSX.Element => {
    const { orderID } = useParams();
    const [error, setError] = useState<string | undefined>(
        orderID === undefined ? "No order ID provided!" : undefined
    );
    const order: ReferencedObject<Order> | undefined = orderID
        ? useOrder(
              orderID,
              [],
              () => setError(undefined),
              (reason) => setError(reason)
          )
        : undefined;

    return order ? (
        <Container
            fluid
            className="d-flex flex-column flex-grow-1 align-items-center justify-content-center"
        >
            <h1 className="mb-4">
                Receipt - $
                {order.data.items
                    .reduce(
                        (total: number, item: CartItem) =>
                            total + item.product.data.price * item.quantity,
                        0
                    )
                    .toLocaleString(undefined, {
                        minimumFractionDigits: 2
                    })}
            </h1>
            <Container className="d-flex flex-column w-25">
                {order.data.items.map((item: CartItem, idx: number) => (
                    <BasicDisplayCard key={idx} item={item} />
                ))}
            </Container>
            <Button variant="success" size="lg" href="#/" className="mt-4">
                Return Home
            </Button>
        </Container>
    ) : (
        <Container className="mt-3">
            {error ? (
                <Alert variant="danger">Failed to load order: {error}</Alert>
            ) : (
                <p>Loading order...</p>
            )}
        </Container>
    );
};
