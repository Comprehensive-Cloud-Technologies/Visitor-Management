import "./SecurityNotesCard.css";

function SecurityNotesCard({

    vehicleData,

    setVehicleData

}) {

    return (

        <div className="security-notes-card">

            <h3>

                📝 Security Notes

            </h3>

            <textarea

                rows="4"

                placeholder="Enter security observations..."

                value={vehicleData.security_notes || ""}

                onChange={(e)=>

                    setVehicleData({

                        ...vehicleData,

                        security_notes:e.target.value

                    })

                }

            />

        </div>

    );

}

export default SecurityNotesCard;