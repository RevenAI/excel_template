doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    meta(name="viewport", content="width=device-width, initial-scale=1.0")
    title Student ID Card - Front
    style.
      @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600&display=swap');

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f5f7fa;
        font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      }

      .card {
        width: 540px;
        height: 340px;
        border-radius: 16px;
        box-shadow: 0 15px 35px rgba(50, 80, 120, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
        background: linear-gradient(145deg, #ffffff 0%, #f8fafd 100%);
        position: relative;
        overflow: hidden;
      }

      .background-pattern {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0.03;
        background-image: radial-gradient(circle at 10% 20%, #2a6bc5 0%, transparent 15%),
                          radial-gradient(circle at 90% 80%, #2a6bc5 0%, transparent 15%),
                          repeating-linear-gradient(45deg, transparent, transparent 10px, #1a4a8f 10px, #1a4a8f 11px);
        z-index: 0;
      }

      .header {
        height: 70px;
        background: linear-gradient(90deg, #1a4a8f 0%, #2a6bc5 100%);
        display: flex;
        align-items: center;
        padding: 0 25px;
        position: relative;
        z-index: 1;
      }

      .school-logo {
        height: 48px;
        width: 48px;
        background-color: white;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      .school-name {
        color: white;
        font-size: 20px;
        font-weight: 600;
        margin-left: 15px;
        letter-spacing: 0.5px;
        line-height: 1.2;
        word-break: break-word; /* allow wrapping */
      }

      .student-id-badge {
        position: absolute;
        top: 15px;
        right: 25px;
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        font-size: 10px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 12px;
        letter-spacing: 0.5px;
        backdrop-filter: blur(5px);
      }

      .photo-container, .qr-container {
        flex: 0 0 auto; /* prevent shrinking in PDF */
      }

      .photo-container img, .qr-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .photo-placeholder {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 150px;
        background-color: #e6edf7;
        border-radius: 8px;
      }

      .photo-placeholder .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        color: #2a6bc5;
        margin-bottom: 8px;
      }

      .info-label {
        font-weight: 600;
        color: #1a3a6e;
        width: 120px;
        font-size: 14px;
      }

      .info-value {
        color: #5a7ba7;
        font-size: 14px;
        word-break: break-word;
      }

      .footer {
        height: 60px;
        background-color: #f8fafd;
        border-top: 1px solid #eef2f7;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 25px;
        position: relative;
        z-index: 1;
        font-size: 12px;
        color: #5a7ba7;
      }

      .motto {
        position: absolute;
        bottom: 80px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 10px;
        color: #a0b4d4;
        font-style: italic;
        letter-spacing: 0.5px;
      }

  body
    .card
      .background-pattern

      //- Header
      .header
        .school-logo
          if schoolLogo
            img(src=schoolLogo, alt=`${schoolName} Logo`)
          else
            - const schoolInitials = schoolName ? schoolName.substring(0, 2).toUpperCase() : 'SC'
            div(style="font-size: 18px; color: #2a6bc5; font-weight: bold; padding: 5px;")= schoolInitials
        .school-name= schoolName
        .student-id-badge STUDENT ID

      //- Main content
      div(style="display:flex; padding:25px; position:relative; z-index:1;")
        //- Photo section
        div(style="width:120px; margin-right:25px; display:flex; flex-direction:column; align-items:center;")
          .photo-container
            if passport
              img(src=passport, alt=fullName)
            else
              .photo-placeholder
                .icon
                  if gender
                    = gender === 'male' ? '👨' : '👩'
                  else
                    | 👤
                div(style="font-size:10px; color:#5a7ba7; text-align:center;") STUDENT
                  br
                  | PHOTO
          div(style="font-size:12px; color:#5a7ba7; font-weight:500;") PHOTO

        //- Info section
        div(style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:8px;")
          div(style="font-size:26px; font-weight:600; color:#1a3a6e; line-height:1.2; word-break:break-word;")= fullName
          div(style="font-size:18px; color:#5a7ba7; font-weight:500;") ID: #{studentId}

          div
            div(style="display:flex;")
              div.info-label Program:
              div.info-value= className
            if classSection
              div(style="display:flex;")
                div.info-label Section:
                div.info-value= classSection
            div(style="display:flex;")
              div.info-label Email:
              div.info-value= email
            if guardianPhone
              div(style="display:flex;")
                div.info-label Guardian:
                div.info-value= guardianPhone

      //- Footer
      .footer
        div VALID: #{dateIssueFormatted} - #{dateDueFormatted}
        div Issued by: #{issuedBy || "Registrar's Office"}

      if motto
        .motto= motto
