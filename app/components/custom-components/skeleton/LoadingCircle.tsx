interface LoadingCircleProps {
    mode?: 'dark' | 'light'; 
} 
export default function LoadingCircle({ mode = 'dark' }: LoadingCircleProps) {
    return (
        <div className="loading-circle">
            <div className={`loader ${mode === 'dark' ? 'loader-dark' : 'loader-light'}`}></div>
        </div>
        
    );
}
