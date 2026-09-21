import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

import "./QRCodeScanner.css";

function QRScannerModal({

    open,

    onClose,

    onVisitorScanned

}) {

    useEffect(() => {

        if (!open) return;

        const scanner = new Html5QrcodeScanner(

            "reader",

            {

                fps: 10,

                qrbox: 250,

                rememberLastUsedCamera: true

            },

            false

        );

        scanner.render(

            async (decodedText) => {

                try {

                    scanner.clear();

                    /*
                        QR contains:
                        http://localhost:5173/security-scan/24
                    */

                    const passId = decodedText.trim();

const response = await axios.get(

    `/api/visitors/pass/${passId}`

);

                    if (response.data.success) {

                        onVisitorScanned(

                            response.data.visitor

                        );

                    }

                }

                catch (err) {

                    console.log(err);

                    alert("Unable to fetch visitor.");

                }

            },

            () => {}

        );

        return () => {

            scanner.clear().catch(() => {});

        };

    }, [open, onVisitorScanned]);

    if (!open) return null;

    return (

        <div className="scanner-overlay">

            <div className="scanner-box">

                <div className="scanner-header">

                    <h2>

                        Scan Visitor QR

                    </h2>

                    <button onClick={onClose}>

                        âœ•

                    </button>

                </div>

                <div id="reader"></div>

            </div>

        </div>

    );

}

export default QRScannerModal;