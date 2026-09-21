import {
    FaSignOutAlt,
    FaUserCircle,
    
    FaClock
} from "react-icons/fa";

import "./CurrentVisitors.css";

function CurrentVisitors({

    visitors = [],

    onCheckout

}) {

    return (

        <div className="current-visitors-card">

            <div className="current-header">

                <h3>

                    Currently At Gate

                </h3>

                <span>

                    {visitors.length} Inside

                </span>

            </div>

            {

                visitors.length === 0 && (

                    <div className="empty-current">

                        <FaUserCircle size={45}/>

                        <p>

                            No Visitors Inside

                        </p>

                    </div>

                )

            }

            {

                visitors.map((visitor)=>(

                    <div

                        key={visitor.id}

                        className="current-row"

                    >

                        <div className="current-photo">

                            {

                                visitor.visitor_photo ?

                                <img

                                    src={visitor.visitor_photo}

                                    alt={visitor.visitor_name}

                                />

                                :

                                <FaUserCircle/>

                            }

                        </div>

                        <div className="current-details">

                            <h4>

                                {visitor.visitor_name}

                            </h4>

                           <p>

    Meeting :

    <strong>

        {visitor.person_to_meet || "-"}

    </strong>

</p>

<span className="company-name">

    {visitor.company_name || "-"}

</span>

                          <div className="current-meta">

    <span>

        <FaClock />

        {

            visitor.check_in ||

            "--"

        }

    </span>

    <span>

        📅

        {

            visitor.visit_date
                ? new Date(visitor.visit_date).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                )
                : "--"

        }

    </span>

</div>
                        </div>

                        <button

                            className="checkout-btn"

                            onClick={()=>

                                onCheckout(visitor.id)

                            }

                        >

                            <FaSignOutAlt/>

                            Check Out

                        </button>

                    </div>

                ))

            }

        </div>

    );

}

export default CurrentVisitors;