import React, {useState} from 'react';
import "./AvatarUpload.css";
import { toAbsoluteUrl } from "../../../helpers/AssetHelpers";


export function AvatarUpload() {
  const [file, setFile] = useState(null);

  const handleChange = function loadFile(event) {
      if (event.target.files.length > 0) {
          const file = URL.createObjectURL(event.target.files[0]);
          setFile(file);
      }
  };

  return (
      <div className="m-2">
        <span className='span'>
                  <img id="avatar" alt='' src={file ? file : toAbsoluteUrl("employees/300-20.jpg")}
                          className='avatar'
                  />
                  </span><br></br>
                  <input type="file" onChange={handleChange} id="upload" accept=".png,.jpg,.jpeg" allowmultiple="true" className='mt-2'/>
      </div>
  );
}