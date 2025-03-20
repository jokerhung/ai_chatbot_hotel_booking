import React from "react";

export function ScrollArea({ children }) {
    return (
        <div className="overflow-y-auto max-h-96">
            {children}
        </div>
    );
}
