import React from 'react';

const ChestItem  = ({name}) => (
    <div className="chest-item mt-2">
        <h3>{name}</h3><hr/>
        <p>Waiting for backend rework to make below button work</p><hr/>
        <button className="btn btn-success">20 gold</button>
    </div>       
);

export default ChestItem;