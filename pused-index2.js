const puppeteer = require("puppeteer");
const fs = require("fs");
var path = require("path");
const express = require("express");

// const app = express();
// const port = 3000;

// app.use(express.static("public"));

// var server = app.listen(port, function (err) {
//   if (err) console.log("Error in Webserver setup");
//   console.log(`Webserver listening at http://localhost:${port}`);
// });

(async () => {
  // Create a browser instance
  const browser = await puppeteer.launch();

  // Create a new page
  const page = await browser.newPage();

  //Get HTML content from HTML file

  const widthInPixels = Math.floor(3.5 * 96);
  const heightInPixels = Math.floor(2 * 96);

  const html = fs.readFileSync(path.resolve(__dirname, `./public/index.html`));

  const filePath = "file://" + path.resolve(__dirname, `./public/index.html`);

  console.log(filePath);

  // await page.setContent(html, { waitUntil: "domcontentloaded" });

  // await page.goto("data:text/html," + html, { waitUntil: "domcontentloaded" });

  await page.goto(filePath, { waitUntil: "networkidle0" });

  // To reflect CSS used for screens instead of print
  await page.setViewport({ width: widthInPixels, height: heightInPixels });

  // Downlaod the PDF
  const pdf = await page.pdf({
    path: "result.pdf",
    printBackground: true,
    width: "3.5in",
    height: "2in",
  });

  // Close the browser instance
  await browser.close();
  // await server.close(function () {
  //   console.log("Stopping webserver.");
  // });
})();

//     const port = 3000;
//     const server = app.listen(port, async () => {
//       const url = `http://localhost:${port}`;
//       const options = {
//         path: `./pdfs/${templateName}.pdf`,
//         width: "3.5in",
//         height: "2in",
//       };
//       const file = { url };
//       await html_to_pdf.generatePdf(file, options);

//       server.close();
//     });
