interface IconDefaultCloseProps {
    width?: string;
    height?: string;
    color?: string;
    type?: 'line' | 'fill'
  }
  
export function IconDefaultClose({ color, width = 'inherit', height, type }: IconDefaultCloseProps) {

    const svg = (
    <>
        { type ? (
            <svg
                width={width ?? 24}
                height={height ?? 24} 
                viewBox="0 -960 960 960"
                fill={color}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z"/>
            </svg>
        ) : (
            <svg 
                width={width ?? 24}
                height={height ?? 24} 
                viewBox="0 -960 960 960"
                fill={color}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M256-227.69 227.69-256l224-224-224-224L256-732.31l224 224 224-224L732.31-704l-224 224 224 224L704-227.69l-224-224-224 224Z"/>
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
