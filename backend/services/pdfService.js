import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";
import process from "process";

import { getVisitorPassHTML } from "./visitorPassTemplate.js";

export const generateVisitorPass = async (visitor, qrPath, companySettings) => {
    const uploadsFolder = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsFolder)) {
        fs.mkdirSync(uploadsFolder, { recursive: true });
    }

    const pdfPath = path.join(uploadsFolder, `visitor-pass-${visitor.id}.pdf`);
    if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
    }

    let qrBase64 = "";
    if (fs.existsSync(qrPath)) {
        const qrBuffer = fs.readFileSync(qrPath);
        qrBase64 = `data:image/png;base64,${qrBuffer.toString("base64")}`;
    }

    const html = getVisitorPassHTML(visitor, qrBase64, companySettings);

    const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 900, height: 650, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: ["load", "networkidle0"] });

    await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
                img.onload = resolve;
                img.onerror = resolve;
            });
        }));
    });

    await page.pdf({
        path: pdfPath,
        format: "A5",
        landscape: true,
        printBackground: true,
        margin: { top: "0", right: "0", bottom: "0", left: "0" }
    });

    await browser.close();
    return pdfPath;
};
