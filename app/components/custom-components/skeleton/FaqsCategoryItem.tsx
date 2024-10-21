import Skeleton from "react-loading-skeleton";

interface FaqsCategoryItemProps {

}

export default function FaqsCategoryItem (){
    return(
        <div className="faqs">
            <div className="sk-faqs__catergory">
                <Skeleton 
                    width={'50%'}
                    height={20}
                />
                <Skeleton 
                    count={3}
                    width={'80%'}
                />
            </div>
            <div className="sk-faqs__catergory">
                <Skeleton 
                    width={'50%'}
                    height={20}
                />
                <Skeleton 
                    count={3}
                    width={'80%'}
                />
            </div>

            <div className="sk-faqs__catergory">
                <Skeleton 
                    width={'50%'}
                    height={20}
                />
                <Skeleton 
                    count={3}
                    width={'80%'}
                />
            </div>
        </div>
        
    )
}