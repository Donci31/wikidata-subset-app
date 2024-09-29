import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-6">
            <div className="container mx-auto flex justify-between items-center px-6">
                <p>© {new Date().getFullYear()} Wikidata Graph Service. All rights reserved.</p>
                <ul className="flex space-x-6">
                    <li><a href="" className="hover:text-blue-400">Privacy Policy</a></li>
                    <li><a href="" className="hover:text-blue-400">Terms of Service</a></li>
                </ul>
            </div>
        </footer>
    );
}