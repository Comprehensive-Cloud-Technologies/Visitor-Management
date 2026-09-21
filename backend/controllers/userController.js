import pool from "../config/db.js";

export const getProfile =
async (req,res)=>{

try{

const { id } = req.params;

const [user] =
await pool.execute(
`
SELECT
id,
full_name,
employee_code,
email,
mobile,
role,
status,
profile_photo,
last_login,
created_at
FROM users
WHERE id = ?
`,
[id]
);

if(user.length === 0)
{
return res.status(404).json({
success:false,
message:"User not found"
});
}

res.json({
success:true,
user:user[0]
});

}
catch(error)
{
console.log(error);

res.status(500).json({
success:false,
message:"Server Error"
});
}

};
export const updateProfile =
async (req,res)=>{

try{

const { id } = req.params;

const {
full_name,
mobile,
email
} = req.body;

await pool.execute(
`
UPDATE users
SET
full_name=?,
mobile=?,
email=?,
updated_at=NOW()
WHERE id=?
`,
[
full_name,
mobile,
email,
id
]
);

res.json({
success:true,
message:"Profile Updated"
});

}
catch(error){

console.log(error);

res.status(500).json({
success:false,
message:"Server Error"
});

}

};
export default {
getProfile,
updateProfile   };