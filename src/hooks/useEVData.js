import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useEVData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Pointing to the provided dataset location
                const response = await fetch('/data-to-visualize/Electric_Vehicle_Population_Data.csv');
                if (!response.ok) throw new Error('Dataset not found. Please ensure it is in public/data-to-visualize/');
                
                const csvData = await response.text();
                
                Papa.parse(csvData, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setData(results.data);
                        setLoading(false);
                    },
                    error: (err) => {
                        setError(err.message);
                        setLoading(false);
                    }
                });
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { data, loading, error };
};
