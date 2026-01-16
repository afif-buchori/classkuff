"use client";
import { ToastContainer } from "react-toastify";

export default function ToastProvider() {
    return (
        <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            toastClassName="bg-foreground text-background rounded-lg shadow-md w-[calc(100%-2rem)] max-w-xs mx-auto mt-4"
        />
    );
}
