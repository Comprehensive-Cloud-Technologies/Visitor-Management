import "./VerificationVehicle.css";

function VerificationVehicle({

    vehicleData,

    setVehicleData

}) {

    const handleChange = (e) => {

        const {

            name,

            value

        } = e.target;

        setVehicleData({

            ...vehicleData,

            [name]: value

        });

    };

    return (

        <div className="verification-section">

            <div className="section-title">

                Vehicle Verification

            </div>

            {/* Has Vehicle */}

            <div className="vehicle-toggle">

                <label>

                    Did the visitor arrive by vehicle?

                </label>

                <select

                    name="has_vehicle"

                    value={vehicleData.has_vehicle}

                    onChange={handleChange}

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

                    <div className="vehicle-grid">

                        <div className="vehicle-field">

                            <label>

                                Vehicle Type

                            </label>

                            <select

                                name="vehicle_type"

                                value={vehicleData.vehicle_type}

                                onChange={handleChange}

                            >

                                <option value="">

                                    Select

                                </option>

                                <option>

                                    Car

                                </option>

                                <option>

                                    Bike

                                </option>

                                <option>

                                    Truck

                                </option>

                                <option>

                                    Bus

                                </option>

                                <option>

                                    Tempo

                                </option>

                                <option>

                                    Other

                                </option>

                            </select>

                        </div>

                        <div className="vehicle-field">

                            <label>

                                Vehicle Number

                            </label>

                            <input

                                type="text"

                                name="vehicle_number"

                                placeholder="MH12AB1234"

                                value={vehicleData.vehicle_number}

                                onChange={handleChange}

                            />

                        </div>

                        <div className="vehicle-field full">

                            <label>

                                Driver Name

                            </label>

                            <input

                                type="text"

                                name="driver_name"

                                placeholder="Driver Name"

                                value={vehicleData.driver_name}

                                onChange={handleChange}

                            />

                        </div>

                    </div>

                    <div className="vehicle-note">

                        🚗 Vehicle details are captured by Security during check-in.

                    </div>

                </>

            }

        </div>

    );

}

export default VerificationVehicle;