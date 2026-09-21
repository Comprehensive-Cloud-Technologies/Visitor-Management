import QRCode from "qrcode";
import path from "path";
import process from "process";
export const generateVisitorQR =
async(visitor)=>{

  const qrPath =
    path.join(
      process.cwd(),
      "uploads",
      `visitor-${visitor.id}.png`
    );

  await QRCode.toFile(
    qrPath,
    JSON.stringify({
      visitorId: visitor.id,
      name: visitor.visitor_name,
      company: visitor.company_name
    })
  );

  return qrPath;

};