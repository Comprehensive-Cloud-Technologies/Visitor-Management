import { useState } from "react";

import "./AssetGallery.css";

function AssetGallery({

    assets = [],

    securityMode = false,

    verifiedAssets = {},

    setVerifiedAssets = () => {}

}) {

    const [previewImage, setPreviewImage] = useState(null);

    const toggleVerify = (index) => {

        setVerifiedAssets((prev) => ({

            ...prev,

            [index]: !prev[index]

        }));

    };

    return (

        <div className="asset-container">

            <div className="asset-header">

                <h3>

                    📦 Assets Carried

                </h3>

                <span className="asset-count">

                    {assets.length} Asset{assets.length !== 1 ? "s" : ""}

                </span>

            </div>

            {

                assets.length === 0 ?

                (

                    <div className="no-assets">

                        No Assets Declared

                    </div>

                )

                :

                (

                    <div className="asset-table-wrapper">

                        <table className="asset-table">

                            <thead>

                                <tr>

                                    <th>Photo</th>

                                    <th>Type</th>

                                    <th>Name</th>

                                    <th>Serial Number</th>



                                    <th>Remarks</th>

                                    {

                                        securityMode &&

                                        <th>

                                            Verify

                                        </th>

                                    }

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    assets.map((asset, index) => (

                                        <tr key={index}>

                                            <td>

                                                {

                                                    asset.asset_photo ?

                                                    (

                                                        <img

                                                            src={asset.asset_photo}

                                                            alt="Asset"

                                                            className="asset-thumb"

                                                            onClick={() =>

                                                                setPreviewImage(asset.asset_photo)

                                                            }

                                                        />

                                                    )

                                                    :

                                                    (

                                                        <div className="thumb-placeholder">

                                                            📦

                                                        </div>

                                                    )

                                                }

                                            </td>

                                            <td>

                                                {asset.asset_type || "-"}

                                            </td>

                                            <td>

                                                {asset.asset_name || "-"}

                                            </td>

                                            <td>

                                                {asset.serial_number || "-"}

                                            </td>

                                            <td>

                                                {asset.asset_remarks || "-"}

                                            </td>

                                            {

                                                securityMode &&

                                                <td>

                                                    <label className="asset-verify">

                                                        <input

                                                            type="checkbox"

                                                            checked={verifiedAssets[index] || false}

                                                            onChange={() =>

                                                                toggleVerify(index)

                                                            }

                                                        />

                                                        Verified

                                                    </label>

                                                </td>

                                            }

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                )

            }

            {

                previewImage &&

                <div

                    className="preview-overlay"

                    onClick={() => setPreviewImage(null)}

                >

                    <img

                        src={previewImage}

                        alt="Preview"

                        className="preview-image"

                    />

                </div>

            }

        </div>

    );

}

export default AssetGallery;