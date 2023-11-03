import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dropdown.css';

const Dropdown = () => {
    // Variables with setters, triggers rerender
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    /**
     * React's hook called at initialization
     * Here we call a public API that returns APIs
     */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // API call
                const result = await axios.get('https://api.publicapis.org/entries');
                // Remove duplicate entries
                let uniqValues = [...new Map(result.data.entries.map(item => [item.API, item])).values()];
                setData(uniqValues);
            } catch (error) {
                setError(error);
                setLoading(false)
            }
        };
        fetchData().then(() => {
            setLoading(false);
        });
    }, []);

    return (
        <div className={"Dropdown"}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={"Dropdown-button"}
            >
                    <span className={"Select"}>Sélectionner une option</span>

                <span className={"Select-direction"}>{isOpen ? '▲' : '▼'}</span>
            </div>
            {isOpen && (
                <div className={"Dropdown-options"}>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error.message}</p>
                    ) : (
                        <div>
                            {data.map((option) => (
                                <div
                                     key={option.API}>
                                    <span>{option.API}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
