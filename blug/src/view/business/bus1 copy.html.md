<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student ID Card - Front</title>
</head>
<body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f7fa; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 20px;">
    <div style="width: 540px; height: 340px; border-radius: 16px; box-shadow: 0 15px 35px rgba(50, 80, 120, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1); background: linear-gradient(145deg, #ffffff 0%, #f8fafd 100%); position: relative; overflow: hidden;">
        <!-- Geometric background pattern -->
        <div style="position: absolute; width: 100%; height: 100%; opacity: 0.03; background-image: radial-gradient(circle at 10% 20%, #2a6bc5 0%, transparent 15%), radial-gradient(circle at 90% 80%, #2a6bc5 0%, transparent 15%), repeating-linear-gradient(45deg, transparent, transparent 10px, #1a4a8f 10px, #1a4a8f 11px); z-index: 0;"></div>
        
        <!-- Header section -->
        <div style="height: 70px; background: linear-gradient(90deg, #1a4a8f 0%, #2a6bc5 100%); display: flex; align-items: center; padding: 0 25px; position: relative;">
            <!-- School logo -->
            <div style="height: 48px; width: 48px; background-color: white; border-radius: 8px; display: flex; justify-content: center; align-items: center; font-size: 24px; color: #2a6bc5; font-weight: bold;">UT</div>
            <div style="color: white; font-size: 20px; font-weight: 600; margin-left: 15px; letter-spacing: 0.5px;">UNIVERSITY OF TECHNOLOGY</div>
            <!-- ID badge -->
            <div style="position: absolute; top: 15px; right: 25px; background-color: rgba(255, 255, 255, 0.2); color: white; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 12px; letter-spacing: 0.5px; backdrop-filter: blur(5px);">STUDENT ID</div>
        </div>
        
        <!-- Main content -->
        <div style="display: flex; padding: 25px; position: relative; z-index: 1;">
            <!-- Photo section -->
            <div style="width: 120px; margin-right: 25px; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 120px; height: 150px; background: linear-gradient(145deg, #e6edf7, #ffffff); border-radius: 8px; display: flex; justify-content: center; align-items: center; margin-bottom: 15px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); border: 1px solid #eef2f7; position: relative; overflow: hidden;">
                    <!-- Photo placeholder -->
                    <div style="width: 100px; height: 130px; background-color: #e6edf7; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <div style="width: 40px; height: 40px; background-color: #ffffff; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: #2a6bc5; font-size: 20px; margin-bottom: 8px;">👤</div>
                        <div style="font-size: 10px; color: #5a7ba7; text-align: center;">STUDENT<br>PHOTO</div>
                    </div>
                </div>
                <div style="font-size: 12px; color: #5a7ba7; font-weight: 500;">PHOTO</div>
            </div>
            
            <!-- Information section -->
            <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 26px; font-weight: 600; color: #1a3a6e; margin-bottom: 8px; letter-spacing: 0.3px;">ALEXANDRA M. CARTER</div>
                <div style="font-size: 18px; color: #5a7ba7; margin-bottom: 20px; font-weight: 500;">ID: UTC-2024-78942</div>
                
                <!-- Details -->
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: flex;">
                        <div style="font-weight: 600; color: #1a3a6e; width: 120px; font-size: 14px;">Program:</div>
                        <div style="color: #5a7ba7; font-size: 14px;">Computer Science</div>
                    </div>
                    <div style="display: flex;">
                        <div style="font-weight: 600; color: #1a3a6e; width: 120px; font-size: 14px;">Year Level:</div>
                        <div style="color: #5a7ba7; font-size: 14px;">Senior</div>
                    </div>
                    <div style="display: flex;">
                        <div style="font-weight: 600; color: #1a3a6e; width: 120px; font-size: 14px;">Status:</div>
                        <div style="color: #5a7ba7; font-size: 14px;">Full-time</div>
                    </div>
                    <div style="display: flex;">
                        <div style="font-weight: 600; color: #1a3a6e; width: 120px; font-size: 14px;">Issued:</div>
                        <div style="color: #5a7ba7; font-size: 14px;">September 1, 2024</div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer section -->
        <div style="height: 60px; background-color: #f8fafd; border-top: 1px solid #eef2f7; display: flex; justify-content: space-between; align-items: center; padding: 0 25px; position: relative; z-index: 1;">
            <div style="font-size: 14px; color: #5a7ba7;">
                VALID UNTIL: <span style="font-weight: 600; color: #1a3a6e;">AUGUST 31, 2025</span>
            </div>
            <div style="font-style: italic; color: #5a7ba7; font-size: 12px;">Registrar's Signature</div>
        </div>
        
        <!-- Link to back -->
        <a href="id-card-back.html" style="position: absolute; bottom: 20px; right: 20px; background-color: #2a6bc5; color: white; text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 14px; cursor: pointer; transition: background-color 0.3s; z-index: 2;">
            VIEW BACK →
        </a>
    </div>
    
    <!-- Instructions -->
    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); text-align: center; max-width: 540px; padding: 15px; background-color: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);">
        <div style="color: #1a3a6e; font-weight: 600; margin-bottom: 5px;">Modern Student ID Card - Front</div>
        <div style="color: #5a7ba7; font-size: 14px;">Click "VIEW BACK" to see the reverse side</div>
    </div>
</body>
</html>