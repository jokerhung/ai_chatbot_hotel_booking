import React from "react";

export function Input({ value, onChange, placeholder }) {
    return (
        <input
            className="w-full p-2 border rounded-lg"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
}
