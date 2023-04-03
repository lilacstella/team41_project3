import React from "react";
import MenuView from "./Gallery";
import Cart from "./Cart";
import "./PurchaseView.css";

export default function PurchaseView() {
    return (
        <div className="app-box">
            <MenuView />
            <Cart />
        </div>
    )
}