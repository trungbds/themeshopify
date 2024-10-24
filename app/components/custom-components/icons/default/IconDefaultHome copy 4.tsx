interface IconDefaultHomeProps {
    width?: string;
    height?: string;
    color?: string;
  }
  
export function IconDefaultHome({ color, width = 'inherit', height }: IconDefaultHomeProps) {

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
                <path d="M240-200h133.85v-237.69h212.3V-200H720v-360L480-740.77 240-560v360Zm-60 60v-450l300-225.77L780-590v450H526.15v-237.69h-92.3V-140H180Zm300-330.38Z"/>
            </svg>
        ) : (
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill={color} >
                <path d="M180-140v-450l300-225.77L780-590v450H556.15v-267.69h-152.3V-140H180Z"/>
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
