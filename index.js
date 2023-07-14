const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.static("public"));

const data = [
  {
    id: 1,
    title: "Estevan Kerin",
    location: "4 Loomis Way",
    designation: "Senior Developer",
    email: "ekerin0@weibo.com",
    website: "ekerin0@sakura.ne.jp",
    phone: "270-954-5917",
    phone1: "748-762-2332",
    logo: "./assets/diamond-logo.png",
    company: "Braun-Ondricka",
  },
  {
    id: 2,
    title: "Orazio Kildahl",
    location: "94142 Buhler Avenue",
    designation: "Technical Writer",
    email: "okildahl1@xrea.com",
    website: "okildahl1@techcrunch.com",
    phone: "302-270-7759",
    phone1: "412-471-9836",
    logo: "./assets/diamond-logo.png",
    company: "Huels-Ortiz",
  },
  {
    id: 3,
    title: "Oren Ginnane",
    location: "9 Mcbride Avenue",
    designation: "Systems Administrator II",
    email: "oginnane2@arizona.edu",
    website: "oginnane2@furl.net",
    phone: "896-575-0707",
    phone1: "100-549-4391",
    logo: "https://robohash.org/vitaetemporibusvoluptatem.png?size=50x50&set=set1",
    company: "Kautzer Inc",
  },
  {
    id: 4,
    title: "Kiley Cheverton",
    location: "26753 Randy Street",
    designation: "Account Representative I",
    email: "kcheverton3@ucoz.com",
    website: "kcheverton3@scribd.com",
    phone: "420-493-3733",
    phone1: "915-914-0071",
    logo: "./assets/logo.png",
    company: "Hackett-Halvorson",
    slogan: "We Are Great",
    zipcode: "67834",
  },
  {
    id: 5,
    title: "Gideon Bereford",
    location: "91548 Mosinee Lane",
    designation: "Research Assistant IV",
    email: "gbereford4@cafepress.com",
    website: "gbereford4@posterous.com",
    phone: "415-226-2637",
    phone1: "905-520-1201",
    logo: "https://robohash.org/pariaturarchitectotemporibus.png?size=50x50&set=set1",
    company: "Schaden-Gibson",
  },
  {
    id: 6,
    title: "Deirdre Dreye",
    location: "623 Golden Leaf Way",
    designation: "Speech Pathologist",
    email: "ddreye5@adobe.com",
    website: "ddreye5@merriam-webster.com",
    phone: "695-366-0326",
    phone1: "356-543-5254",
    logo: "./assets/v-logo.png",
    company: "Lemke and Sons",
  },
  {
    id: 7,
    title: "Sinclare Debill",
    location: "58182 Golf Course Plaza",
    designation: "Structural Engineer",
    email: "sdebill6@macromedia.com",
    website: "sdebill6@wordpress.org",
    phone: "212-976-4168",
    phone1: "463-401-8882",
    logo: "./assets/tepb-logo.png",
    company: "Hoppe-Hgy",
  },
  {
    id: 8,
    title: "Daryn Cutteridge",
    location: "2 2nd Road",
    designation: "Manager",
    email: "dcutteridge7@npr.org",
    website: "eridge7@mediafire.com",
    phone: "562-931-6424",
    phone1: "904-213-1742",
    logo: "./assets/template-7.svg",
    logo1: "./assets/template-7-white.svg",
    company: "Cassin and Sons",
    slogan: "Togather We Stand",
  },
  {
    id: 9,
    title: "Judie Bleby",
    location: "2573 Novick Way",
    designation: "Operator",
    email: "jbleby8@gnu.org",
    website: "jbleby8@deviantart.com",
    phone: "510-527-4196",
    phone1: "817-865-8844",
    logo: "./assets/diamond-logo.png",
    company: "Kuhn LLC",
  },
  {
    id: 10,
    title: "Lorrin Yabsley",
    location: "109 Hooker Plaza",
    designation: "Executive Secretary",
    email: "lyabsley9@spotify.com",
    website: "lyabsley9@odnoklassniki.ru",
    phone: "233-146-8787",
    phone1: "202-377-8327",
    logo: "./assets/circle-logo-white.png",
    company: "Bode-Hoeger",
    slogan: "We turn insights into impact.",
  },
];

Handlebars.registerHelper("imageDataUri", function (filePath) {
  filePath = path.resolve(__dirname, `./public/assets/${filePath}`);

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath).toString("base64");
    const mimeType = "image/jpeg";

    return `data:${mimeType};base64,${fileContent}`;
  } else {
    return "";
  }
});

async function generatePdf(templateName, templateData) {
  try {
    const templatePath = path.resolve(
      __dirname,
      `./views/partials/${templateName}.handlebars`
    );

    if (fs.existsSync(templatePath)) {
      const source = fs.readFileSync(templatePath).toString();
      const template = Handlebars.compile(source);
      const outputString = template(templateData);

      fs.writeFileSync(
        path.resolve(__dirname, `./public/index.html`),
        outputString
      );

      console.log("Generating pdf", templateName);

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      const widthInPixels = Math.floor(3.5 * 96);
      const heightInPixels = Math.floor(2 * 96);

      const filePath =
        "file://" + path.resolve(__dirname, `./public/index.html`);

      await page.goto(filePath, { waitUntil: "networkidle0" });

      await page.setViewport({
        width: widthInPixels,
        height: heightInPixels,
      });

      const pdf = await page.pdf({
        path: `./pdfs/${templateName}.pdf`,
        printBackground: true,
        width: "3.5in",
        height: "2in",
      });

      await browser.close();
      console.log("PDF generated successfully!");
    } else {
      console.error(`Template file '${templatePath}' not found.`);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

generatePdf("template3", data[3]);
// generatePdf("template4", data[2]);
// generatePdf("template5", data[5]);
// generatePdf("template6", data[6]);
// generatePdf("template7", data[7]);
// generatePdf("template8", data[1]);
// generatePdf("template9", data[9]);
