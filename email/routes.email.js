const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');
const auth = require("./../middleware/auth")
var { jsPDF } = require("jspdf")

sgMail.setApiKey("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");

// rout

router.post("/sendMail",  async(req, res) => {

  const msg = {
    to: req.body.to,
    from: req.body.from, // Use the email address or domain you verified above
    subject: req.body.subject,
    text: req.body.text,
    html: req.body.text,
  };

  (async () => {
    try {
      await sgMail.send(msg);
      
      return res.json({
        status: true,
        message: "Email verified",
        data: null
      })
    } catch (error) {
  
      if (error.response) {
        
      return res.json({
        status: false,
        message: error.response.body,
        data: null
      })
      }
    }
  })();
})

// router.post("/savePDF",  async(req, res) => {
//   const pdfString = JSON.parse(req.body.string)
  
//   let doc = jsPDF("l", "px", [595, 842]);
//   try{
      
//     doc.html(pdfString, {
//       async callback(doc) {
//         doc.save("./a4.pdf");
//         // window.open(doc.output("bloburl"), "_blank");
//       }
//     });

//   }catch(err){

//   }

// })

module.exports = router