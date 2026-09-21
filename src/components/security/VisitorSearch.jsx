import {
    FaSearch,
    FaQrcode,
    FaTimes
} from "react-icons/fa";

import "./VisitorSearch.css";

function VisitorSearch({

    keyword,
    setKeyword,

    loading,

    suggestions,

    setSuggestions,

    showSuggestions,

    setShowSuggestions,

    onSelectVisitor,

    onScan

}) {

    const clearSearch = () => {

        setKeyword("");

        setSuggestions([]);

        setShowSuggestions(false);

    };

    return (

        <div className="visitor-search-card">

            <div className="visitor-search-header">

                <h2>

                    Search Visitor

                </h2>

                <p>

                    Search by Visitor ID, Name or Mobile

                </p>

            </div>

            <div className="visitor-search-box">

                <FaSearch className="search-icon" />

                <input

                    type="text"

                    placeholder="Search Visitor..."

                    value={keyword}

                    onChange={(e)=>setKeyword(e.target.value)}

                    onFocus={()=>{

                        if(suggestions.length>0){

                            setShowSuggestions(true);

                        }

                    }}

                />

            </div>

            {

                loading &&

                <div className="search-loading">

                    Searching...

                </div>

            }

            {

                showSuggestions &&

                suggestions.length>0 &&

                <div className="visitor-search-dropdown">

                    {

                        suggestions.map((visitor)=>(

                            <div

                                key={visitor.id}

                                className="visitor-search-item"

                                onClick={()=>{

                                    onSelectVisitor(visitor);

                                    clearSearch();

                                }}

                            >

                                <div className="visitor-search-photo">

                                    {

                                        visitor.visitor_photo

                                        ?

                                        <img

                                            src={visitor.visitor_photo}

                                            alt={visitor.visitor_name}

                                        />

                                        :

                                        <div className="visitor-placeholder">

                                            {

                                                visitor.visitor_name

                                                ?.charAt(0)

                                                ?.toUpperCase()

                                            }

                                        </div>

                                    }

                                </div>

                                <div className="visitor-search-info">

                                    <div className="visitor-search-name">

                                        {visitor.visitor_name}

                                    </div>

                                    <div className="visitor-search-id">

                                        VIS-

                                        {String(visitor.id).padStart(5,"0")}

                                    </div>

                                </div>

                                <div className="visitor-search-status approved">

                                    {visitor.status}

                                </div>

                            </div>

                        ))

                    }

                </div>

            }

            {

                showSuggestions &&

                keyword &&

                !loading &&

                suggestions.length===0 &&

                <div className="visitor-search-empty">

                    No Approved Visitor Found

                </div>

            }

            <div className="visitor-search-actions">

                <button

                    className="scan-btn"

                    onClick={onScan}

                >

                    <FaQrcode />

                    Scan QR

                </button>

                <button

                    className="clear-btn"

                    onClick={clearSearch}

                >

                    <FaTimes />

                    Clear

                </button>

            </div>

        </div>

    );

}

export default VisitorSearch;