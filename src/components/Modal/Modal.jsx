import React from 'react';

function Modal({showModal , setShowModal , children}) {

    if(showModal)
    {
        var bg = document.getElementById('Background');
        document.getElementById('root').appendChild(bg);
    }
    /*else
    {
        var root = document.getElementById('root');
        root.removeChild(root.lastChild);
    }*/

    console.log(showModal);
    console.log(document.getElementById('root').childNodes);

    return (
        
        <>
            {showModal ? (
                    <div className="Background" id = "Background">
                        <div className = "ModalWrapper">
                            <h5>Modal</h5>
                            {children}
                        </div>
                    </div>
            ) : (
                null
            )    
            }
        </>
    )
}

export default Modal;
