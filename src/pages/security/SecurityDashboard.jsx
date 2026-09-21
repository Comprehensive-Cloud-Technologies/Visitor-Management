// import { useState } from "react";
// import axios from "axios";

// import SearchBar from "../../components/security/SearchBar";
// import VisitorInfoCard from "../../components/security/VisitorInfoCard";
// import AssetGallery from "../../components/security/AssetGallery";
// // import SecurityChecklist from "../../components/security/SecurityChecklist";
// import VehicleVerificationCard from "../../components/security/VehicleVerificationCard";
// import {
//     checkOutVisitor
// }
// from "../../services/visitorService";

// import "./SecurityDashboard.css";

// function SecurityDashboard() {

//     const [searchId, setSearchId] = useState("");

//     const [visitor, setVisitor] = useState(null);

//     const [loading, setLoading] = useState(false);

//     const currentUser =
//         JSON.parse(
//             localStorage.getItem("user")
//         );
// const [vehicleData, setVehicleData] = useState({

//     has_vehicle: "0",

//     vehicle_type: "",

//     vehicle_number: "",

//     driver_name: ""

// });
//     // const [checklist, setChecklist] = useState({

//     //     photoVerified: false,

//     //     idVerified: false,

//     //     assetVerified: false,

//     //     vehicleVerified: false,

//     //     signatureVerified: false

//     // });

//     const searchVisitor = async () => {

//         if (!searchId) {

//             alert("Enter Visitor ID");

//             return;

//         }

//         try {

//             setLoading(true);

//             const response =
//                 await axios.get(
//                     `/api/visitors/scan/${searchId}`
//                 );

//             if (response.data.success) {

//     const data = response.data.visitor;

//     setVisitor(data);

//     setVehicleData({

//         has_vehicle:
//             data.has_vehicle
//                 ? String(data.has_vehicle)
//                 : "0",

//         vehicle_type:
//             data.vehicle_type || "",

//         vehicle_number:
//             data.vehicle_number || "",

//         driver_name:
//             data.driver_name || ""

//     });

// }

//         }

//         catch (error) {

//             console.log(error);

//             alert("Visitor Not Found");

//             setVisitor(null);

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     const handleCheckOut = async () => {

//         try {

//             const response =
//                 await checkOutVisitor(
//                     visitor.id
//                 );

//             if (response.data.success) {

//                 alert(response.data.message);

//                 setVisitor({

//                     ...visitor,

//                     status: "Checked Out",

//                     check_out:
//                         new Date().toLocaleTimeString()

//                 });

//             }

//         }

//         catch (error) {

//             alert(

//                 error.response?.data?.message ||

//                 "Unable to Check Out Visitor"

//             );

//         }

//     };

//     return (

//         <div className="security-page">

//             <SearchBar

//     searchId={searchId}

//     setSearchId={setSearchId}

//     searchVisitor={searchVisitor}

//     loading={loading}

//     clearVisitor={() => {

//     setVisitor(null);

//     setChecklist({

//         photoVerified: false,

//         idVerified: false,

//         assetVerified: false,

//         vehicleVerified: false,

//         signatureVerified: false

//     });

// }}
// />

//             {

//                 loading &&

//                 <h2>

//                     Loading...

//                 </h2>

//             }

//             {

//                 visitor &&

//                 <>

//                     {

//                         visitor.status === "CHECKED IN" &&

//                         <div className="security-alert success">

//                             ðŸŸ¢ This visitor is already inside the premises.

//                         </div>

//                     }

//                     {

//                         visitor.status === "Checked Out" &&

//                         <div className="security-alert danger">

//                             ðŸ”´ This visitor has already exited the premises.

//                         </div>

//                     }

//                     <VisitorInfoCard

//                         visitor={visitor}

//                     />
//                     <VehicleVerificationCard

//     vehicleData={vehicleData}

//     setVehicleData={setVehicleData}

// />

//                     <AssetGallery

//                         assets={visitor.assets}

//                     />
// {/* 
//                     <SecurityChecklist

//                         visitor={visitor}

//                         checklist={checklist}

//                         setChecklist={setChecklist}

//                         currentUser={currentUser}

//                         onCheckInSuccess={setVisitor}

//                     /> */}

//                     {

//                         visitor.status === "CHECKED IN" &&

//                         <div className="checkout-section">

//                             <button

//                                 className="checkout-btn"

//                                 onClick={handleCheckOut}

//                             >

//                                 ðŸšª Check Out Visitor

//                             </button>

//                         </div>

//                     }

//                 </>

//             }

//         </div>

//     );

// }

// export default SecurityDashboard;
import { useState, useEffect, useCallback, useRef } from "react";

import Webcam from "react-webcam";

import "./SecurityDashboard.css";

import SecurityHeader from "../../components/security/SecurityHeader";
import DashboardStats from "../../components/security/DashboardStats";
import VisitorSearch from "../../components/security/VisitorSearch";
import CurrentVisitors from "../../components/security/CurrentVisitors";
import RecentActivity from "../../components/security/RecentActivity";
import GateStatus from "../../components/security/GateStatus";
import VisitorVerificationModal from "../../components/security/VisitorVerificationModal";
import VisitorProfileSection from "../../components/security/VisitorProfileSection";

import VisitorDetailsSection from "../../components/security/VisitorDetailsSection";

import HostInfoSection from "../../components/security/HostInfoSection";

import VehicleVerificationCard from "../../components/security/VehicleVerificationCard";

import AssetGallery from "../../components/security/AssetGallery";
import SecurityNotesCard from "../../components/security/SecurityNotesCard";
import {

    getCurrentVisitors,

    getRecentActivity,

    getDashboardStats,

      searchVisitors as searchVisitorsAPI,

    checkInVisitor,

    checkOutVisitor,

  getVisitorById,
  getVisitorPassUrl

} from "../../services/visitorService";


import QRScannerModal from "../../components/security/QRScannerModal";
function SecurityDashboard() {

  

    /* ==========================================
            SEARCH
    ========================================== */

    const [keyword, setKeyword] = useState("");

    const [loading, setLoading] = useState(false);

    const [suggestions, setSuggestions] = useState([]);

    const [showSuggestions, setShowSuggestions] = useState(false);

    /* ==========================================
            SELECTED VISITOR
    ========================================== */

    const [selectedVisitor, setSelectedVisitor] = useState(null);

    const [drawerOpen, setDrawerOpen] = useState(false);

    /* ==========================================
            CURRENT VISITORS
    ========================================== */

    const [currentVisitors, setCurrentVisitors] = useState([]);

const [activities, setActivities] = useState([]);

const [stats, setStats] = useState({

    inside:0,

    todayIn:0,

    todayOut:0,

    pending:0

});
  const [vehicleData, setVehicleData] = useState({

    has_vehicle: "0",

    vehicle_type: "",

    vehicle_number: "",

    driver_name: "",

    security_notes: ""

});
const webcamRef = useRef(null);

const [livePhoto, setLivePhoto] = useState("");
const [livePhotoCapturedAt, setLivePhotoCapturedAt] = useState("");

const [cameraOn, setCameraOn] = useState(false);
const [verifiedAssets, setVerifiedAssets] = useState({});

const [visitorAssets, setVisitorAssets] = useState([]);
const [scannerOpen, setScannerOpen] = useState(false);

    /* ==========================================
            RECENT ACTIVITY
    ========================================== */

   
const [checkingIn, setCheckingIn] = useState(false);

    /* ==========================================
            SEARCH API
    ========================================== */

   const searchVisitors = useCallback(async (value) => {

    if (!value.trim()) {

        setSuggestions([]);

        return;

    }

    try {

        setLoading(true);

        const response = await searchVisitorsAPI(value);

        if (response.success) {

            setSuggestions(response.visitors);

        }

        else {

            setSuggestions([]);

        }

    }

    catch(error){

        console.log(error);

        setSuggestions([]);

    }

    finally{

        setLoading(false);

    }

},[]);
const loadDashboard = useCallback(async () => {

    try {

        const [

            current,

            activity,

            dashboard

        ] = await Promise.all([

            getCurrentVisitors(),

            getRecentActivity(),

            getDashboardStats()

        ]);

        if (current.success) {

            setCurrentVisitors(current.visitors);

        }

        if (activity.success) {

            setActivities(activity.activities);

        }

        if (dashboard.success) {

            setStats(dashboard.stats);

        }

    }

    catch (error) {

        console.log(error);

    }

}, []);
useEffect(() => {

    let mounted = true;

    const fetchDashboard = async () => {

        try {

            const [

                current,

                activity,

                dashboard

            ] = await Promise.all([

                getCurrentVisitors(),

                getRecentActivity(),

                getDashboardStats()

            ]);

            if (!mounted) return;

            setCurrentVisitors(current.visitors || []);

            setActivities(activity.activities || []);

            setStats(dashboard.stats || {

                inside: 0,

                todayIn: 0,

                todayOut: 0,

                pending: 0

            });

        }

        catch (error) {

            console.log(error);

        }

    };

    fetchDashboard();

    return () => {

        mounted = false;

    };

}, []);
    /* ==========================================
            LIVE SEARCH
    ========================================== */

    useEffect(() => {

        const timer = setTimeout(() => {

            if (keyword.trim()) {

                searchVisitors(keyword);

                setShowSuggestions(true);

            }

            else {

                setSuggestions([]);

                setShowSuggestions(false);

            }

        }, 300);

        return () => clearTimeout(timer);

    }, [keyword, searchVisitors]);

    /* ==========================================
            SELECT VISITOR
    ========================================== */

   
const selectVisitor = async (visitor) => {

    try {

        setLoading(true);

        const response = await getVisitorById(visitor.id);

        if (response.data.success) {

            const visitorData = response.data.visitor;

            setSelectedVisitor(visitorData);

            setVisitorAssets(visitorData.assets || []);

            setVehicleData({

                has_vehicle: visitorData.has_vehicle
                    ? String(visitorData.has_vehicle)
                    : "0",

                vehicle_type: visitorData.vehicle_type || "",

                vehicle_number: visitorData.vehicle_number || "",

                driver_name: visitorData.driver_name || "",

                security_notes: visitorData.security_notes || ""

            });

            setVerifiedAssets({});

            setDrawerOpen(true);

            setShowSuggestions(false);

            setKeyword("");

            setSuggestions([]);

        }

    }

    catch (error) {

        console.log(error);

    }

    finally {

        setLoading(false);

    }

};
const handleVisitorScanned = async (visitor) => {

    try {

        const response = await getVisitorById(visitor.id);

        if (!response.data.success) {

            alert("Visitor not found");

            return;

        }

        const visitorData = response.data.visitor;

        setSelectedVisitor(visitorData);

        setVisitorAssets(visitorData.assets || []);

        setVehicleData({

            has_vehicle: visitorData.has_vehicle
                ? String(visitorData.has_vehicle)
                : "0",

            vehicle_type: visitorData.vehicle_type || "",

            vehicle_number: visitorData.vehicle_number || "",

            driver_name: visitorData.driver_name || "",

            security_notes: visitorData.security_notes || ""

        });

        setVerifiedAssets({});

        setScannerOpen(false);

        setDrawerOpen(true);

    }

    catch (error) {

        console.log(error);

        alert("Unable to load visitor.");

    }

};
    /* ==========================================
            CLOSE DRAWER
    ========================================== */

    const closeDrawer = () => {

    setDrawerOpen(false);

    setSelectedVisitor(null);
    setLivePhoto("");
setLivePhotoCapturedAt("");
setCameraOn(false);

    setVisitorAssets([]);

    setVerifiedAssets({});

    setVehicleData({

    has_vehicle: "0",

    vehicle_type: "",

    vehicle_number: "",

    driver_name: "",

    security_notes: "",
    

});

};
const handleCheckIn = async () => {

    if (!selectedVisitor) return;
    if (!livePhoto) {

    alert("Please capture the visitor's live photo before Check In.");

    return;

}

    try {

        setCheckingIn(true);

        const user = JSON.parse(

            localStorage.getItem("user")

        );

       await checkInVisitor(

    selectedVisitor.id,

    {

        checked_in_by: user.full_name,

        live_photo: livePhoto,
           live_photo_captured_at: livePhotoCapturedAt,


        has_vehicle: vehicleData.has_vehicle,

        vehicle_type: vehicleData.vehicle_type,

        vehicle_number: vehicleData.vehicle_number,

        driver_name: vehicleData.driver_name,

        verifiedAssets,

        security_notes: vehicleData.security_notes

    }

);

       await loadDashboard();

alert("Visitor Checked In Successfully");

closeDrawer();

    }

    catch (error) {

        console.log(error);

        alert(

            error.response?.data?.message ||

            "Check In Failed"

        );

    }

    finally {

        setCheckingIn(false);

    }

};
const capturePhoto = () => {

    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {

        setLivePhoto(imageSrc);

        // Store capture timestamp
        setLivePhotoCapturedAt(
            new Date().toISOString()
        );

        setCameraOn(false);

    }

};
const handleCheckout = async (visitorId) => {

    try {

        const user = JSON.parse(

            localStorage.getItem("user")

        );

        const response = await checkOutVisitor(

            visitorId,

            {

                checked_out_by: user.full_name

            }

        );

        if(response.data.success){

            await loadDashboard();

            alert("Visitor Checked Out Successfully");

        }

    }

    catch(error){

        console.log(error);

        alert(

            error.response?.data?.message ||

            "Unable to check out visitor."

        );

    }

};

        return (

        <div className="security-dashboard">

            {/* ==========================
                    HEADER
            =========================== */}

            <SecurityHeader />

            <div className="dashboard-container">

                {/* ==========================
                    DASHBOARD STATS
                =========================== */}

              <DashboardStats

    stats={stats}

/>

                {/* ==========================
                    VISITOR SEARCH
                =========================== */}

                <VisitorSearch

                    keyword={keyword}

                    setKeyword={setKeyword}

                    loading={loading}

                    suggestions={suggestions}

                    setSuggestions={setSuggestions}

                    showSuggestions={showSuggestions}

                    setShowSuggestions={setShowSuggestions}

                    onSelectVisitor={selectVisitor}

                    onScan={() => setScannerOpen(true)}

                />

                {/* ==========================
                    MAIN CONTENT
                =========================== */}

                <div className="dashboard-top-section">

                    {/* Left Section */}

                    <div className="dashboard-left">
<CurrentVisitors

    visitors={currentVisitors}

    onCheckout={handleCheckout}

/>

                    </div>

                    {/* Right Section */}

                    <div className="dashboard-right">

                        <RecentActivity

                            activities={activities}

                        />

                    </div>

                </div>

                {/* ==========================
                    GATE STATUS
                =========================== */}

                <GateStatus />

            </div>

            {/* ==========================
                VISITOR VERIFICATION DRAWER
            =========================== */}

 <VisitorVerificationModal
    open={drawerOpen}
   onClose={closeDrawer}
    onCheckIn={handleCheckIn}
    checkingIn={checkingIn}
    onPrint={() => {

        if (!selectedVisitor) return;

     window.open(

    getVisitorPassUrl(selectedVisitor.id),

    "_blank"

);

    }}
      livePhoto={livePhoto}

>

    <VisitorProfileSection

        visitor={selectedVisitor}

    />

    <div className="verification-grid">

        <VisitorDetailsSection

            visitor={selectedVisitor}

        />

        <HostInfoSection

            visitor={selectedVisitor}

        />
       <div className="camera-card">

    <div className="camera-header">

        <div>

            <h3>ðŸ“· Live Visitor Verification</h3>

            <p>
                Capture visitor photo before allowing entry.
            </p>

        </div>

        <span
            className={
                livePhoto
                    ? "camera-status verified"
                    : "camera-status waiting"
            }
        >
            {livePhoto ? "âœ” Verified" : "Waiting"}
        </span>

    </div>

    {

        !cameraOn ?

        (

            <>

                {

                    livePhoto ?

                    (

                        <div className="captured-section">

                            <img
                                src={livePhoto}
                                alt="Captured"
                                className="live-photo"
                            />

                            <div className="capture-info">

                                <div className="capture-success">

                                    âœ” Photo Captured Successfully

                                </div>

                                <div className="capture-time">

                                    {new Date().toLocaleString()}

                                </div>

                            </div>

                            <div className="camera-actions">

                                <button

                                    className="retake-btn"

                                    onClick={() => {

                                        setLivePhoto("");
setLivePhotoCapturedAt("");
setCameraOn(true);

                                    }}

                                >

                                    ðŸ”„ Retake

                                </button>

                                <button

                                    className="remove-btn"

                                    onClick={() => {

                                        setLivePhoto("");
setLivePhotoCapturedAt("");

                                    }}

                                >

                                    ðŸ—‘ Remove

                                </button>

                            </div>

                        </div>

                    )

                    :

                    (

                        <div className="camera-placeholder">

                            <div className="camera-icon">

                                ðŸ“·

                            </div>

                            <h4>No Live Photo</h4>

                            <p>

                                Capture visitor's face before check-in.

                            </p>

                            <button

                                className="camera-btn"

                                onClick={() => setCameraOn(true)}

                            >

                                ðŸ“· Start Camera

                            </button>

                        </div>

                    )

                }

            </>

        )

        :

        (

            <div className="camera-live">

                <Webcam

                    audio={false}

                    ref={webcamRef}

                    screenshotFormat="image/jpeg"

                    className="camera-view"

                />

                <div className="camera-actions">

                    <button

                        className="capture-btn"

                        onClick={capturePhoto}

                    >

                        ðŸ“¸ Capture Photo

                    </button>

                    <button

                        className="cancel-camera-btn"

                        onClick={() => setCameraOn(false)}

                    >

                        Cancel

                    </button>

                </div>

            </div>

        )

    }

</div>
</div>

    <VehicleVerificationCard

        vehicleData={vehicleData}

        setVehicleData={setVehicleData}

    />

    <AssetGallery

        assets={visitorAssets}

        securityMode={true}

        verifiedAssets={verifiedAssets}

        setVerifiedAssets={setVerifiedAssets}

    />

    <SecurityNotesCard

        vehicleData={vehicleData}

        setVehicleData={setVehicleData}

    />

</VisitorVerificationModal>
<QRScannerModal

    open={scannerOpen}

    onClose={() => setScannerOpen(false)}

    onVisitorScanned={handleVisitorScanned}

/>
        </div>

    );

}

export default SecurityDashboard;