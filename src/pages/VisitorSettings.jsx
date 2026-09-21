import { useState } from "react";

function VisitorSettings() {

  const [settings,setSettings] =
  useState({
    require_id_proof:true,
    require_signature:true,
    auto_checkout:false
  });

  return (

    <div>

      <h1>
        Visitor Settings
      </h1>

      <label>

        <input
          type="checkbox"
          checked={
            settings.require_id_proof
          }
          onChange={(e) => setSettings({...settings, require_id_proof: e.target.checked})}
        />

        Require ID Proof

      </label>

      <br/><br/>

      <label>

        <input
          type="checkbox"
          checked={
            settings.require_signature
          }
          onChange={(e) => setSettings({...settings, require_signature: e.target.checked})}
        />

        Require Signature

      </label>

      <br/><br/>

      <label>

        <input
          type="checkbox"
          checked={
            settings.auto_checkout
          }
          onChange={(e) => setSettings({...settings, auto_checkout: e.target.checked})}
        />

        Auto Check-Out

      </label>

    </div>

  );

}

export default VisitorSettings;