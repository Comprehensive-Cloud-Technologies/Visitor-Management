

import "./VehicleVerificationCard.css";

function VehicleVerificationCard({

    vehicleData,
    setVehicleData

}) {

    const handleChange = (e) => {

        const { name, value } = e.target;

        setVehicleData((prev) => ({

            ...prev,

            [name]: value

        }));

    };

    return (

        <div className="vehicle-card">

            <div className="vehicle-header">

                <h3>

                   

                  🚗 Vehicle Verification

                </h3>

               

            </div>

            <div className="vehicle-question">

                <label>

                    Did the visitor arrive in a vehicle?

                </label>

                <div className="radio-group">

                    <label className="radio-option">

                        <input

                            type="radio"

                            name="has_vehicle"

                            value="0"

                            checked={vehicleData.has_vehicle === "0"}

                            onChange={handleChange}

                        />

                        No

                    </label>

                    <label className="radio-option">

                        <input

                            type="radio"

                            name="has_vehicle"

                            value="1"

                            checked={vehicleData.has_vehicle === "1"}

                            onChange={handleChange}

                        />

                        Yes

                    </label>

                </div>

            </div>

            {

                vehicleData.has_vehicle === "1" &&

                <div className="vehicle-grid">

                    <div className="form-group">

                        <label>

                            Vehicle Type

                        </label>

                        <select

                            name="vehicle_type"

                            value={vehicleData.vehicle_type}

                            onChange={handleChange}

                        >

                            <option value="">

                                Select Vehicle

                            </option>

                            <option value="Car">

                                🚗 Car

                            </option>

                            <option value="Bike">

                                🏍 Bike

                            </option>

                            <option value="Truck">

                                🚚 Truck

                            </option>

                            <option value="Bus">

                                🚌 Bus

                            </option>

                            <option value="Tempo">

                                🚛 Tempo

                            </option>

                            <option value="Other">

                                Other

                            </option>

                        </select>

                    </div>

                    <div className="form-group">

                        <label>

                            Vehicle Number

                        </label>

                        <input

                            type="text"

                            name="vehicle_number"

                            value={vehicleData.vehicle_number}

                            onChange={handleChange}

                            placeholder="MH12AB1234"

                        />

                    </div>

                    <div className="form-group full-width">

                        <label>

                            Driver Name

                        </label>

                        <input

                            type="text"

                            name="driver_name"

                            value={vehicleData.driver_name}

                            onChange={handleChange}

                            placeholder="Enter Driver Name"

                        />

                    </div>

                </div>

            }

        </div>

    );

}

export default VehicleVerificationCard;