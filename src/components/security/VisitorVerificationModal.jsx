// import "./VisitorVerificationDrawer.css";

// function VisitorVerificationDrawer({

//     open,
//     onClose,
//     children

// }) {

//     return (

//         <>

//             {/* Overlay */}

//             <div

//                 className={`drawer-overlay ${open ? "show" : ""}`}

//                 onClick={onClose}

//             />

//             {/* Drawer */}

//             <div

//                 className={`verification-drawer ${open ? "open" : ""}`}

//             >

//                 {/* Header */}

//                 <div className="drawer-header">

//                     <div>

//                         <h2>

//                             Visitor Verification

//                         </h2>

//                         <p>

//                             Verify visitor before allowing entry.

//                         </p>

//                     </div>

//                     <button

//                         className="drawer-close"

//                         onClick={onClose}

//                     >

//                         ✕

//                     </button>

//                 </div>

//                 {/* Body */}

//                 <div className="drawer-body">

//                     {children}

//                 </div>

//             </div>

//         </>

//     );

// }

// export default VisitorVerificationDrawer;
import {
    FaTimes
} from "react-icons/fa";

import "./VisitorVerificationModal.css";


function VisitorVerificationModal({

    open,

    onClose,

    onCheckIn,

    onPrint,

    checkingIn,
    livePhoto,

    children

}){

    if (!open) return null;

    return (

        <div
            className="verification-modal-overlay"
            onClick={onClose}
        >

            <div

                className="verification-modal"

                onClick={(e)=>e.stopPropagation()}

            >

                {/* Header */}

                <div className="verification-modal-header">

                    <div>

                        <h2>

                            Visitor Verification

                        </h2>

                        <p>

                            Verify visitor details before allowing entry.

                        </p>

                    </div>

                    <button

                        className="verification-close"

                        onClick={onClose}

                    >

                        <FaTimes/>

                    </button>

                </div>

                {/* Body */}

              <div className="verification-modal-body">

    {children}

</div>

<div className="verification-modal-footer">

    <button

        className="reject-btn"

        onClick={onClose}

    >

        Cancel

    </button>

    <button

        className="print-btn"

        onClick={onPrint}

    >

        🖨 Print Pass

    </button>

    <button

        className="checkin-btn"

        onClick={onCheckIn}

        disabled={checkingIn}

    >

        {

            checkingIn

                ? "Checking In..."
                : !livePhoto

? "Capture Photo First"

                : "✅ Check In Visitor"

        }

    </button>

</div>
            </div>

        </div>

    );

}

export default VisitorVerificationModal;