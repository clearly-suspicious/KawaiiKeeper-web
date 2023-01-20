import { NextPage } from "next";

import CheckoutForm from "../components/stripe/CheckoutForm";

const Donate: NextPage = () => {
  return (
    <>
      <div className="page-container">
        <h1>Donate with Checkout</h1>
        <p>Donate to our project 💖</p>
        <CheckoutForm />
      </div>
    </>
  );
};

export default Donate;
