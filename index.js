const express = require("express");
const app = express();
const port = 3000;

const parseCookies = (req) => {
  const cookiesString = req.headers.cookie;
  const cookiesObject = {};
  if (cookiesString) {
    cookiesString.split("; ").forEach((cookieString) => {
      const [key, value] = cookieString.split("=");
      cookiesObject[key] = value;
    });
  }
  return cookiesObject;
};

app.get("/", (req, res) => {
  const cookiesObject = parseCookies(req);
  const trackingCodePopup = cookiesObject.sneaky
    ? ""
    : `
    <div>
      <p>Hey, do you mind if I get sneaky and track you?</p>
      <button onClick="allowSneaky();">Sure, I don't mind</button>
      <button onClick="denySneaky();">Maybe not</button>
    </div>
    <script>
      const allowSneaky = () => {
        document.cookie = "sneaky=true";
        window.location.reload();
      }
      const denySneaky = () => {
        document.cookie = "sneaky=false";
        window.location.reload();
      }
    </script>
  `;

  const trackingCode =
    cookiesObject.sneaky === "true"
      ? "<div>Hey I am the tracking code. I am tracking you right now. Boo! 👻</div>"
      : "<div>I am sorry but I am not allowed to track you.</div>";

  if (cookiesObject.sneaky === "true") {
    res.cookie("disappointment", "none");
  }
  if (cookiesObject.sneaky === "false") {
    res.cookie("disappointment", "infinite");
  }

  res.send(`
    ${trackingCodePopup}
    ${trackingCode}
  `);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
