import { Scanner } from "@yudiel/react-qr-scanner";

function QrScanner({

    onDetected,

    onClose

}) {

    return (

        <div className="scanner-overlay">

            <div className="scanner-box">

                <div className="scanner-header">

                    <h2>

                        Scan Visitor QR

                    </h2>

                    <button onClick={onClose}>

                        ✕

                    </button>

                </div>

                <Scanner

                    constraints={{

                        facingMode: "environment"

                    }}

                   onScan={(result) => {

    if (!result?.length) return;

    const qrValue = result[0].rawValue.trim();

    if (!qrValue.startsWith("VIS-")) {

        alert("Invalid Visitor QR");

        return;

    }

    onDetected(qrValue);

}}

                    onError={(error)=>{

                        console.log(error);

                    }}

                />

            </div>

        </div>

    );

}

export default QrScanner;