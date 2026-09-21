import "./SearchResults.css";

function SearchResults({

    visitors = [],

    onSelectVisitor

}) {

    if (!visitors.length) {

        return (

            <div className="search-results-empty">

                Search a visitor to view details.

            </div>

        );

    }

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(

            "en-IN",

            {

                day: "2-digit",

                month: "short",

                year: "numeric"

            }

        );

    };

    return (

        <div className="search-results-card">

            <div className="results-header">

                <h3>

                    Search Results

                </h3>

                <span>

                    {visitors.length} Visitor(s)

                </span>

            </div>

            {

                visitors.map((visitor)=>(

                    <div

                        key={visitor.id}

                        className="result-item"

                    >

                        <div className="result-photo">

                            {

                                visitor.visitor_photo ?

                                <img

                                    src={visitor.visitor_photo}

                                    alt={visitor.visitor_name}

                                />

                                :

                                <div className="photo-placeholder">

                                    👤

                                </div>

                            }

                        </div>

                        <div className="result-details">

                            <div className="result-name">

                                {visitor.visitor_name}

                            </div>

                            <div className="result-company">

                                {visitor.company_name || "-"}

                            </div>

                            <div className="result-host">

                                Host :

                                {" "}

                                {visitor.employee_name || "-"}

                            </div>

                            <div className="result-date">

                                Visit :

                                {" "}

                                {formatDate(visitor.visit_date)}

                            </div>

                        </div>

                        <div className="result-right">

                            <span

                                className={`result-status ${visitor.status

                                    .toLowerCase()

                                    .replace(/\s/g,"-")}`}

                            >

                                {visitor.status}

                            </span>

                            <button

                                onClick={()=>onSelectVisitor(visitor)}

                            >

                                Open

                            </button>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default SearchResults;