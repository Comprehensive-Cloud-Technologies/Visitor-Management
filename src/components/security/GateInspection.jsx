import { useMemo } from "react";
import "./GateInspection.css";

function GateInspection({

    visitor,

    vehicleData,
    setVehicleData,

    verifiedAssets,
    setVerifiedAssets

}) {

    if (!visitor) return null;

    const assets = visitor.assets || [];

    const handleVehicleChange = (e) => {

        const { name, value } = e.target;

        setVehicleData(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const toggleAsset = (assetId) => {

        if (verifiedAssets.includes(assetId)) {

            setVerifiedAssets(

                verifiedAssets.filter(id => id !== assetId)

            );

        }

        else {

            setVerifiedAssets([

                ...verifiedAssets,

                assetId

            ]);

        }

    };

    const summary = useMemo(() => {

        const total = assets.length;

        const verified = verifiedAssets.length;

        const pending = total - verified;

        return {

            total,

            verified,

            pending

        };

    }, [assets, verifiedAssets]);

    return (

        <div className="gate-card">

            <div className="gate-header">

                <h2>

                    🚧 Gate Inspection

                </h2>

                <p>

                    Verify vehicle and visitor belongings before allowing entry.

                </p>

            </div>

            {/* ============================
                    VEHICLE SECTION
            ============================ */}

            <div className="gate-section">

                <h3>

                    🚗 Vehicle Information

                </h3>

                <div className="vehicle-grid">

                    <div className="vehicle-field">

                        <label>

                            Vehicle

                        </label>

                        <select

                            name="has_vehicle"

                            value={vehicleData.has_vehicle}

                            onChange={handleVehicleChange}

                        >

                            <option value="0">

                                No

                            </option>

                            <option value="1">

                                Yes

                            </option>

                        </select>

                    </div>

                    {

                        Number(vehicleData.has_vehicle) === 1 &&

                        <>

                            <div className="vehicle-field">

                                <label>

                                    Vehicle Type

                                </label>

                                <select

                                    name="vehicle_type"

                                    value={vehicleData.vehicle_type}

                                    onChange={handleVehicleChange}

                                >

                                    <option value="">

                                        Select

                                    </option>

                                    <option>Car</option>

                                    <option>Bike</option>

                                    <option>Truck</option>

                                    <option>Tempo</option>

                                    <option>Bus</option>

                                    <option>Other</option>

                                </select>

                            </div>

                            <div className="vehicle-field">

                                <label>

                                    Vehicle Number

                                </label>

                                <input

                                    type="text"

                                    name="vehicle_number"

                                    value={vehicleData.vehicle_number}

                                    onChange={handleVehicleChange}

                                />

                            </div>

                            <div className="vehicle-field full">

                                <label>

                                    Driver Name

                                </label>

                                <input

                                    type="text"

                                    name="driver_name"

                                    value={vehicleData.driver_name}

                                    onChange={handleVehicleChange}

                                />

                            </div>

                        </>

                    }

                </div>

            </div>

            {/* ============================
                    ASSET SECTION
            ============================ */}

            <div className="gate-section">

                <div className="asset-title">

                    <h3>

                        📦 Declared Assets

                    </h3>

                    <span>

                        {summary.total} Assets

                    </span>

                </div>

                {

                    assets.length === 0 ?

                    (

                        <div className="no-assets">

                            Visitor has not declared any assets.

                        </div>

                    )

                    :

                    (

                        <div className="asset-grid">

                            {

                                assets.map(asset => {

                                    const checked =

                                        verifiedAssets.includes(asset.id);

                                    return (

                                        <div

                                            className="asset-box"

                                            key={asset.id}

                                        >

                                            <div className="asset-photo">

                                                {

                                                    asset.asset_photo ?

                                                    (

                                                        <img

                                                            src={asset.asset_photo}

                                                            alt=""

                                                        />

                                                    )

                                                    :

                                                    "📦"

                                                }

                                            </div>

                                            <div className="asset-info">

                                                <h4>

                                                    {asset.asset_type}

                                                </h4>

                                                <p>

                                                    {asset.asset_name}

                                                </p>

                                                <small>

                                                    Qty : {asset.quantity}

                                                </small>

                                                {

                                                    asset.asset_remarks &&

                                                    <div className="asset-remarks">

                                                        {asset.asset_remarks}

                                                    </div>

                                                }

                                            </div>

                                            <label className="verify-checkbox">

                                                <input

                                                    type="checkbox"

                                                    checked={checked}

                                                    onChange={() =>

                                                        toggleAsset(asset.id)

                                                    }

                                                />

                                                Verified

                                            </label>

                                        </div>

                                    );

                                })

                            }

                        </div>

                    )

                }

            </div>

            {/* ============================
                    SUMMARY
            ============================ */}

            <div className="inspection-summary">

                <div>

                    <span>Total</span>

                    <strong>

                        {summary.total}

                    </strong>

                </div>

                <div>

                    <span>Verified</span>

                    <strong className="green">

                        {summary.verified}

                    </strong>

                </div>

                <div>

                    <span>Pending</span>

                    <strong className="orange">

                        {summary.pending}

                    </strong>

                </div>

            </div>

        </div>

    );

}

export default GateInspection;