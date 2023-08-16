import React, { useEffect, useState } from 'react';
import { useDopm } from '../context/dopm.context';

const Clock = () => {

    const dopm = useDopm();
    const [date, setDate] = useState<Date>(new Date);

    useEffect(() => {
        let timer = setInterval(() => tick(), 1000);

        return () => {
            // when component unmounts, clear interval
            clearInterval(timer)
        };
    }, [])

    const tick = () => {
        setDate(new Date)
    }

    return (
        <div style={{  }}>
            {!dopm.isMobileDevice &&
                <h1 style={{
                    // padding: "7px 0 0 10px",
                    margin: "0",
                    textAlign: "center",
                    color: "white",
                    fontSize: "0.9em",
                    width: "10rem"
                }}>
                    {date.toLocaleString()}
                </h1>
            }
            
        </div>
    )
}

export default Clock
