import { useState } from 'react';
import { IconDefaultGridView } from "../icons/default/IconDefaultGridView";
import { IconDefaultListView } from "../icons/default/IconDefaultListView";

interface GridListProps {
    type?: string;
}

export default function GridList() {
    const [viewType, setViewType] = useState<'grid' | 'list'>('grid'); // Mặc định là 'grid'

    return (
    <div className="grid-list inline-flex">
        <button
            type="button"
            className={`btn list-view ${viewType === 'list' ? 'selected' : ''}`} 
            onClick={() => setViewType('list')} 
        >
            <IconDefaultListView
                width='20'
                height='20'
                color={`${viewType === 'list' ? '#000' : '#ddd'}`} 
            />
            <span>List</span>
        </button>

        <button
            type="button"
            className={`btn grid-view ${viewType === 'grid' ? 'selected' : ''}`} 
            onClick={() => setViewType('grid')} 
        >
            <IconDefaultGridView 
                width='20'
                height='20'
                color={`${viewType === 'grid' ? '#000' : '#ddd'}`} 
            />
            <span>Grid</span>
        </button>
    </div>
    );
}