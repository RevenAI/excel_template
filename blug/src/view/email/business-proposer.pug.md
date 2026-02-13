extends ./base-layout.pug

block content
  table(width="100%" cellspacing="0" cellpadding="0" style="font-family: Arial, sans-serif; color: #333;")
    // Header with brand identity
    tr
      td(style="padding: 30px 0; text-align: center; background: #1e3a8a; color: white;")
        h1(style="margin: 0; font-size: 26px; font-weight: bold;") NexaLearn Systems
        p(style="margin: 5px 0 0; font-size: 14px;") NexaLearn Systems and Technological Innovation

    // Body content
    tr
      td(style="padding: 30px 20px; background: #fafafa;")
        h2(style="margin: 0 0 20px; font-size: 20px; color: #1e3a8a;") #{subject}
        p(style="margin: 0 0 20px; font-size: 15px; line-height: 1.6;")
          | Dear Partner,
        p(style="margin: 0 0 20px; font-size: 15px; line-height: 1.6;")
          | #{message}

        // Call to action
        table(width="100%" cellspacing="0" cellpadding="0")
          tr
            td(align="center" style="padding: 20px 0;")
              a(href="https://nexalearn.com/contact" style="background: #1e3a8a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; font-size: 15px;") Contact Us

        // Signature
        p(style="margin: 30px 0 0; font-size: 15px; line-height: 1.6;")
          | Best regards,
        p(style="margin: 5px 0 0; font-size: 15px; font-weight: bold;") Abidemi Tijani
        p(style="margin: 0; font-size: 14px; color: #555;") NexaLearn Systems and Technological Innovation

    // Footer
    tr
      td(style="padding: 20px; text-align: center; border-top: 1px solid #eee; background: #f9f9f9;")
        p(style="margin: 0; font-size: 13px; color: #666;") &copy; #{new Date().getFullYear()} NexaLearn Systems. All rights reserved.
        p(style="margin: 5px 0 0; font-size: 13px; color: #666;")
          | Visit us at 
          a(href="https://nexalearn.com" style="color: #1e3a8a; text-decoration: none;") www.nexalearn.com
        p(style="margin: 5px 0 0; font-size: 13px; color: #666;")
          | For inquiries: 
          a(href="mailto:support@nexalearn.com" style="color: #1e3a8a;") support@nexalearn.com
