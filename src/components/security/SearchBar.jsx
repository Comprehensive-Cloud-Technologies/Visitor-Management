import { useEffect, useState } from "react";
import axios from "axios";

import "./SearchBar.css";
import logo from "../../assets/company-logo.png";

function SearchBar({

    searchId,

    setSearchId,

    searchVisitor,

    loading,

    clearVisitor

}) {

    const [suggestions, setSuggestions] = useState([]);

    const [showSuggestions, setShowSuggestions] = useState(false);
useEffect(() => {

    const loadSuggestions = async () => {

        if (!searchId.trim()) {
            return;
        }

        try {

            const response = await axios.get(
                `/api/visitors/search/${searchId}`
            );

            if (response.data.success) {
                setSuggestions(response.data.visitors);
            }

        } catch (error) {
            console.log(error);
        }

    };

    const timer = setTimeout(loadSuggestions, 250);

    return () => {
        clearTimeout(timer);
    };

}, [searchId]);

    return (

        <div className="search-header">

            {/* Logo */}

            <div className="header-logo">

                <img
                    src={logo}
                    alt="Company Logo"
                />

            </div>

            {/* Left */}

            <div className="header-left">

                <div className="shield">

                    ðŸ›¡ï¸

                </div>

                <div>

                    <h1>

                        Visitor Management System

                    </h1>

                    <p>

                        Security Control Center

                    </p>

                </div>

            </div>

            {/* Search */}

            <div className="search-panel">

                <label>

                    Search Visitor

                </label>
  <div className="search-wrapper"></div>
                <div className="search-row">

                    <input

                        type="text"

                        placeholder="Visitor ID / Name / Mobile / Company"

                        value={searchId}

                    onChange={(e) => {

    const value = e.target.value;

    setSearchId(value);

    setShowSuggestions(value.trim() !== "");

    if (value.trim() === "") {

        setSuggestions([]);

        clearVisitor();     // <-- Clear visitor card

    }

}}

                        onFocus={() =>
                            setShowSuggestions(true)
                        }

                        onKeyDown={(e) => {

                            if (e.key === "Enter") {

                                setShowSuggestions(false);

                                searchVisitor();

                            }

                        }}

                    />

                    <button

                        onClick={() => {

                            setShowSuggestions(false);

                            searchVisitor();

                        }}

                        disabled={loading}

                    >

                        {

                            loading

                                ?

                                "Searching..."

                                :

                                "ðŸ” Search"

                        }

                    </button>

                </div>

                {

                    showSuggestions &&

                    suggestions.length > 0 &&

                    <div className="search-suggestions">

                      {
    suggestions
        .filter((visitor) => {

            if (!searchId) return true;

            return (

                visitor.id
                    .toString()
                    .includes(searchId)

                ||

                visitor.visitor_name
                    .toLowerCase()
                    .includes(searchId.toLowerCase())

                ||

                visitor.mobile
                    ?.includes(searchId)

                ||

                visitor.company_name
                    ?.toLowerCase()
                    .includes(searchId.toLowerCase())

            );

        })
        .slice(0,8)
        .map((visitor)=>(

            <div

                key={visitor.id}

                className="suggestion-item"

                onClick={()=>{

                    setSearchId(String(visitor.id));

                    setShowSuggestions(false);

                    setTimeout(searchVisitor,100);

                }}

            >

                <div className="suggestion-left">

                    <div className="visitor-id">

                        VIS-{String(visitor.id).padStart(5,"0")}

                    </div>

                    <div className="visitor-name">

                        {visitor.visitor_name}

                    </div>

                    <div className="visitor-company">

                        {visitor.company_name}

                    </div>

                </div>

                <span

                    className={`status ${visitor.status
                        .toLowerCase()
                        .replace(/\s/g,"-")}`}

                >

                    {visitor.status}

                </span>

            </div>

        ))
}

                        

                    </div>

                }

            </div>

        </div>

    );

}

export default SearchBar;