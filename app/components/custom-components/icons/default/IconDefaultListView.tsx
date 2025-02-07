interface IconDefaultListViewProps {
    width?: string;
    height?: string;
    color?: string;
  }
  
export function IconDefaultListView({ color, width = 'inherit', height }: IconDefaultListViewProps) {

    const svg = (
    <>
        { !color ? (
            <svg
                width={width ?? 24}
                height={height ?? 24} 
                viewBox="0 -960 960 960"
                fill='inherit'
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M140-300.19v-365q0-30.12 21.24-51.31t51.07-21.19h535.38q29.83 0 51.07 21.19Q820-695.31 820-665.19v365q0 30.11-21.24 51.3-21.24 21.2-51.07 21.2H212.31q-29.83 0-51.07-21.2Q140-270.08 140-300.19Zm60-287.5h90v-90h-77.69q-5.39 0-8.85 3.46t-3.46 8.85v77.69Zm150 0h410v-77.69q0-5.39-3.46-8.85t-8.85-3.46H350v90Zm0 150h410v-90H350v90Zm0 150h397.69q5.39 0 8.85-3.46Q760-294.62 760-300v-77.69H350v90Zm-137.69 0H290v-90h-90V-300q0 5.38 3.46 8.85 3.46 3.46 8.85 3.46Zm-12.31-150h90v-90h-90v90Z"/>
            </svg>
        ) : (
            <svg 
                
                width={width ?? 24}
                height={height ?? 24} 
                viewBox="0 -960 960 960" 
                fill={color} 
                xmlns="http://www.w3.org/2000/svg" 
                >
                    <path d="M360-160h520v-160H360v160ZM80-640h200v-160H80v160Zm0 240h200v-160H80v160Zm0 240h200v-160H80v160Zm280-240h520v-160H360v160Zm0-240h520v-160H360v160Z"/>
            </svg>
        )}
    </>
    )

    return (
        <div className="icon">
            {svg}
        </div>
    );
}
