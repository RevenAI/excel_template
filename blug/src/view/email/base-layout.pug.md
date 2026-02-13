doctype html
html
  head
    meta(http-equiv="Content-Type" content="text/html; charset=utf-8")
    meta(name="viewport" content="width=device-width, initial-scale=1.0")
    title= subject || "Welcome"
    style.
      body { 
        font-family: Arial, sans-serif;
        background-color: #f5f7fa;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
      }
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
        }
      }

  body(style="margin: 0; padding: 0;")
    table.container(width="100%" cellspacing="0" cellpadding="0")
      tr
        td(align="center" style="padding: 30px 0;")
          block header
            if logoUrl
              img(src=logoUrl alt="Logo" width="150" style="display: block;")
            else
              h1(style="margin: 0; color: #4f46e5; font-size: 24px;")= appName || "Our App"

      tr
        td(style="padding: 0 20px;")
          block content

      tr
        td(style="padding: 30px 20px; text-align: center; color: #666; font-size: 12px;")
          block footer
            p(style="margin: 0;") © #{year || new Date().getFullYear()} #{appName || "Our Company"}
            p(style="margin: 10px 0 0;")
              a(href=unsubscribeUrl || "#" style="color: #4f46e5;") Unsubscribe