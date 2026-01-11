doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Student ID Card - Back
    style.
      @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600&display=swap');

      * { margin:0; padding:0; box-sizing:border-box; }

      body {
        margin:0;
        padding:0;
        display:flex;
        justify-content:center;
        align-items:center;
        min-height:100vh;
        background-color:#f5f7fa;
        font-family:'Segoe UI', system-ui, -apple-system, sans-serif;
      }

      .card {
        width:540px;
        height:340px;
        border-radius:16px;
        box-shadow:0 15px 35px rgba(50,80,120,0.15),0 5px 15px rgba(0,0,0,0.1);
        background:linear-gradient(145deg,#f8fafd 0%,#ffffff 100%);
        position:relative;
        overflow:hidden;
      }

      .background-pattern {
        position:absolute;
        width:100%;
        height:100%;
        opacity:0.03;
        background-image:radial-gradient(circle at 90% 20%, #2a6bc5 0%, transparent 15%),
                         radial-gradient(circle at 10% 80%, #2a6bc5 0%, transparent 15%),
                         repeating-linear-gradient(-45deg, transparent, transparent 10px, #1a4a8f 10px, #1a4a8f 11px);
        z-index:0;
      }

      .magnetic-strip {
        position:absolute;
        top:20px;
        width:100%;
        height:40px;
        background:linear-gradient(90deg,#1a1a1a,#333,#1a1a1a);
        z-index:1;
      }

      .main-content {
        padding:25px;
        height:100%;
        display:flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        position:relative;
        z-index:2;
      }

      .student-id {
        font-size:22px;
        letter-spacing:2px;
        color:#1a3a6e;
        font-weight:600;
        margin-bottom:20px;
        background-color: rgba(255,255,255,0.7);
        padding:10px 20px;
        border-radius:8px;
        backdrop-filter:blur(5px);
      }

      .barcode {
        height:60px;
        width:280px;
        background-color:#1a3a6e;
        border-radius:4px;
        margin-bottom:10px;
        position:relative;
        overflow:hidden;
        box-shadow:0 4px 8px rgba(0,0,0,0.1);
        flex:0 0 auto;
      }

      .barcode::before {
        content:'';
        position:absolute;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:repeating-linear-gradient(90deg,transparent,transparent 2px,rgba(255,255,255,0.3) 2px,rgba(255,255,255,0.3) 4px);
      }

      .barcode-text {
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        color:rgba(255,255,255,0.2);
        font-size:14px;
        letter-spacing:8px;
        font-weight:bold;
      }

      .qr-container {
        width:120px;
        height:120px;
        background:linear-gradient(145deg,#e6edf7,#ffffff);
        border-radius:8px;
        display:flex;
        justify-content:center;
        align-items:center;
        margin-bottom:10px;
        box-shadow:0 4px 8px rgba(0,0,0,0.05);
        position:relative;
        overflow:hidden;
        flex:0 0 auto;
      }

      .qr-container img {
        width:100%;
        height:100%;
        object-fit:contain;
        padding:8px;
      }

      .qr-placeholder {
        width:96px;
        height:96px;
        background-color:#1a3a6e;
        position:relative;
        overflow:hidden;
      }

      .qr-marker {
        position:absolute;
        width:28px;
        height:28px;
        background-color:#1a3a6e;
        border:4px solid #fff;
      }

      .footer {
        display:flex;
        flex-direction:column;
        align-items:center;
        width:100%;
        margin-top:10px;
        z-index:2;
      }

      .signature {
        position:absolute;
        bottom:60px;
        right:25px;
        display:flex;
        flex-direction:column;
        align-items:flex-end;
        z-index:2;
      }

      .validity {
        position:absolute;
        bottom:25px;
        left:25px;
        font-size:10px;
        color:#8fa3c2;
        z-index:2;
      }

  body
    .card
      .background-pattern
      .magnetic-strip

      .main-content
        .student-id= studentId

        //- Barcode
        .barcode
          .barcode-text= studentId
        div(style="font-size:12px;color:#5a7ba7;letter-spacing:1px;font-weight:500;text-align:center;") SCAN BARCODE FOR VERIFICATION

        //- QR
        .qr-container
          if qrPayload
            img(src=qrPayload, alt=`QR Code for ${fullName}`)
          else
            .qr-placeholder
              .qr-marker(style="top:8px; left:8px")
              .qr-marker(style="top:8px; right:8px")
              .qr-marker(style="bottom:8px; left:8px")
        div(style="font-size:12px;color:#5a7ba7;font-weight:500;margin-bottom:10px;") SCAN FOR DIGITAL VERIFICATION

        //- Footer info
        .footer
          div(style="font-size:14px;color:#5a7ba7;font-weight:600;margin-bottom:5px;")= schoolName
          if motto
            div(style="font-size:11px;color:#5a7ba7;font-style:italic;text-align:center;margin-bottom:5px;")= motto
          div(style="font-size:10px;color:#8fa3c2;text-align:center;line-height:1.4;") #{address} #{guardianPhone ? `• Emergency: ${guardianPhone}` : ''}

      //- Signature
      if signature
        .signature
          div(style="height:1px;width:100px;background-color:#5a7ba7;margin-bottom:2px;")
          div(style="font-size:10px;color:#5a7ba7;")= signature

      //- Validity
      .validity Valid: #{formatDate(dateIssue, "MMM D, YYYY")} - #{formatDate(dateDue, "MMM D, YYYY")}
