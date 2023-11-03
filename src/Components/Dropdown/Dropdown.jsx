import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dropdown.css';

const Dropdown = () => {
    // Variables with setters, triggers rerender
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);

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

    /**
     * Handles option selection/deselection
     * @param option selected item
     */
    function handleSelect(option) {
        // Already selected option
        if (selectedOptions.includes(option)) {
            const updatedOptions = selectedOptions.filter((item) => item !== option);
            setSelectedOptions(updatedOptions);
        } else {
            // Adding option
            setSelectedOptions([...selectedOptions, option]);
        }
    }

    return (
        <div className={"Dropdown"}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={"Dropdown-button"}
            >
                {selectedOptions.length > 0 ? (
                    selectedOptions.map((option) => (
                        <div
                            key={option.id}
                            className={"Selected-option"}
                        >
                            <span>{option.API}</span>
                            <span
                                className={"Cross"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(option);
                                }}
                            >
                &#x2715;
              </span>
                        </div>
                    ))
                ) : (
                    <span className={"Select"}>Sélectionner une option</span>
                )}

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
                                    style={{
                                        // Different background color when item is selected
                                        backgroundColor: selectedOptions.some((item) => item.API === option.API) ? '#009866' : '',
                                        padding: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleSelect(option)}
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
