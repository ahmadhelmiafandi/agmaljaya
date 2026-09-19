import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AdminSettings() {
    return (
        <div className="max-w-6xl mx-auto">
            <Outlet />
        </div>
    );
}
