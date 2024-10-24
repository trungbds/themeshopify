interface IconDefaultArrowForwardProps {
    width?: string;
    height?: string;
    color?: string;
    type?: 'line' | 'fill'
  }
  
export function IconDefaultArrowForward({ color, width = 'inherit', height, type }: IconDefaultArrowForwardProps) {

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
                <path d="M683.15-460H200v-40h483.15L451.46-731.69 480-760l280 280-280 280-28.54-28.31L683.15-460Z"/>
            </svg>
        ) : (
            <svg 
                width={width ?? 24}
                height={height ?? 24} 
                viewBox="0 -960 960 960"
                fill={color}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M683.15-460H200v-40h483.15L451.46-731.69 480-760l280 280-280 280-28.54-28.31L683.15-460Z"/>
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
