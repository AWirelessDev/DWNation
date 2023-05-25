import React, { useState, useEffect } from 'react';
import { toAbsoluteUrl } from "../../../helpers/AssetHelpers"

  const BinaryImage = ({ base64Data, altText, altClassName, isNavBar }) => {
    const [imageUrl, setImageUrl] = useState(null);


    useEffect(() => {
      if (base64Data) {
        const imageUrl = `data:image/jpeg;base64,${base64Data}`;
        setImageUrl(imageUrl);
      }
    }, [base64Data]);
  
    if (!imageUrl) {
      return isNavBar ? (
        <img src={toAbsoluteUrl("employees/people.png")} alt={altText} className={"employee-img"} />
      ) : (
        <img src={toAbsoluteUrl("employees/people.png")} alt={altText} className={"profile-img"} />
      );
      
    }
    
    return <img src={imageUrl} alt={altText} className={altClassName} />;
  };
  
  export default BinaryImage;