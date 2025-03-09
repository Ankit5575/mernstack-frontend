 import React from 'react'
 import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
 
 function PaypalButton({amount , onSuccess , onError}) {

   return (
     <div>
       <PayPalScriptProvider 
       options={{
        "client-Id":
import.meta.env.VITE_PAYPAL_CLIENT_ID,
       }}
       >
        <PayPalButtons
        style={{layout:"vertical"}}
        createOrder={(data,action)=>{
            return action.order.create({
                purchase_units:[{amount:{value:amount}}],
            })
        }}
        onApprove={(data,action)=>{
            return action.order.capture().then(onSuccess) 
        }}
        onError={onError}
        />

        </PayPalScriptProvider>
     </div>
   )
 }
 
 export default PaypalButton
 