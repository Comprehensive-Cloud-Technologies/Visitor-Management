import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaBuilding,
  FaUserShield,
  FaUserCircle,
  FaLock,
  FaBell,
  FaPalette,
  FaSearch,
  FaEnvelope,
  FaIdCard
}
from "react-icons/fa";

import "./Settings.css";

function Settings() {

  const navigate = useNavigate();

  const [search,setSearch] =
    useState("");

 const sections = [

{
title:"Organization",
className:"organization-card",

items:[
{
name:"Company Settings",
icon:<FaBuilding />,
route:"/company-settings"
},
{
name:"Visitor Settings",
icon:<FaIdCard />,
route:"/settings/visitor"
},
{
name:"Branding",
icon:<FaPalette />,
route:"/settings/company"
}
]
},

{
title:"Users & Roles",
className:"users-card",

items:[
{
name:"Profile",
icon:<FaUserCircle />,
route:"/profile"
},
{
name:"Roles",
icon:<FaUserShield />,
route:"/roles"
},
{
name:"Role Permissions",
icon:<FaLock />,
route:"/role-permissions"
}
]
},

{
title:"Security",
className:"security-card",

items:[
{
name:"Notifications",
icon:<FaBell />,
route:"/settings/notifications"
},
{
name:"Email Templates",
icon:<FaEnvelope />,
route:"/settings/email"
}
]
},

{
title:"System",
className:"system-card",

items:[
{
name:"Dashboard Preferences",
icon:<FaPalette />,
route:"/settings/dashboard"
},
{
name:"Audit Logs",
icon:<FaLock />,
route:"/settings/logs"
}
]
}

];

  return (

    <div className="settings-page">

      {/* HEADER */}

    <div className="settings-header">

<div>

<h1>
⚙ Settings Center
</h1>

<p>
Manage organization,
security, visitor workflow,
branding and permissions.
</p>

</div>

</div>

      {/* SEARCH */}

      <div className="settings-search">

        <FaSearch />

        <input
          type="text"
          placeholder="Search settings..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* GRID */}

      <div className="settings-grid">

        {
          sections.map(
            (section,index)=>(
             <div
key={index}
className={`settings-card ${section.className}`}
> 

                <h3>
                  {section.title}
                </h3>

                {
                  section.items
                  .filter(item =>
                    item.name
                    .toLowerCase()
                    .includes(
                      search.toLowerCase()
                    )
                  )
                  .map(
                    (item,idx)=>(
                      <div
                        key={idx}
                        className="setting-item"
                        onClick={() =>
                          navigate(item.route)
                        }
                      >

                        <span className="setting-icon">
                          {item.icon}
                        </span>

                        <span>
                          {item.name}
                        </span>

                      </div>
                    )
                  )
                }

              </div>
            )
          )
        }

      </div>

    </div>

  );

}

export default Settings;