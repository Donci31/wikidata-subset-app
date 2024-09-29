// src/components/Header.js

import React from 'react';

export default function Header() {
    return (
        <header className="bg-gray-900 text-white">
            <nav className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="text-2xl font-bold">
                    <h1>Wikidata Graph Service</h1>
                </div>
                <ul className="flex space-x-6 text-lg">
                    <li><a href="" className="hover:text-blue-400">Home</a></li>
                    <li><a href="" className="hover:text-blue-400">Dashboard</a></li>
                    <li><a href="" className="hover:text-blue-400">Services</a></li>
                    <li><a href="" className="hover:text-blue-400">Profile</a></li>
                </ul>
            </nav>
        </header>
    );
}
