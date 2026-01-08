<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student ID Card - Back</title>
</head>
<body style="margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f5f7fa; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 20px;">
    <div style="width: 540px; height: 340px; border-radius: 16px; box-shadow: 0 15px 35px rgba(50, 80, 120, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1); background: linear-gradient(145deg, #f8fafd 0%, #ffffff 100%); position: relative; overflow: hidden;">
        <!-- Geometric background pattern -->
        <div style="position: absolute; width: 100%; height: 100%; opacity: 0.03; background-image: radial-gradient(circle at 90% 20%, #2a6bc5 0%, transparent 15%), radial-gradient(circle at 10% 80%, #2a6bc5 0%, transparent 15%), repeating-linear-gradient(-45deg, transparent, transparent 10px, #1a4a8f 10px, #1a4a8f 11px); z-index: 0;"></div>
        
        <!-- Main content -->
        <div style="padding: 25px; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; z-index: 1;">
            
            <!-- Large ID number -->
            <div style="font-size: 22px; letter-spacing: 2px; color: #1a3a6e; font-weight: 600; margin-bottom: 30px; background-color: rgba(255, 255, 255, 0.7); padding: 10px 20px; border-radius: 8px; backdrop-filter: blur(5px);">UTC-2024-78942</div>
            
            <!-- Barcode section -->
            <div style="margin-bottom: 30px; text-align: center;">
                <div style="height: 60px; width: 280px; background-color: #1a3a6e; border-radius: 4px; margin-bottom: 10px; position: relative; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <!-- Barcode pattern -->
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.3) 2px, rgba(255, 255, 255, 0.3) 4px);"></div>
                </div>
                <div style="font-size: 12px; color: #5a7ba7; letter-spacing: 1px; font-weight: 500;">SCAN FOR VERIFICATION</div>
            </div>
            
            <!-- QR Code section -->
            <div style="margin-bottom: 30px; display: flex; flex-direction: column; align-items: center;">
                <div style="width: 120px; height: 120px; background: linear-gradient(145deg, #e6edf7, #ffffff); border-radius: 8px; display: flex; justify-content: center; align-items: center; margin-bottom: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05); position: relative; overflow: hidden;">
                    <!-- QR Code pattern -->
                    <div style="width: 96px; height: 96px; background-color: #1a3a6e; position: relative; overflow: hidden;">
                        <!-- QR code pattern simulation -->
                        <div style="position: absolute; width: 100%; height: 100%; background-image: 
                            linear-gradient(to right, #ffffff 0%, #ffffff 12%, transparent 12%, transparent 20%, #ffffff 20%, #ffffff 32%, transparent 32%, transparent 40%, #ffffff 40%, #ffffff 52%, transparent 52%, transparent 60%, #ffffff 60%, #ffffff 72%, transparent 72%, transparent 80%, #ffffff 80%, #ffffff 92%, transparent 92%),
                            linear-gradient(to bottom, #ffffff 0%, #ffffff 12%, transparent 12%, transparent 20%, #ffffff 20%, #ffffff 32%, transparent 32%, transparent 40%, #ffffff 40%, #ffffff 52%, transparent 52%, transparent 60%, #ffffff 60%, #ffffff 72%, transparent 72%, transparent 80%, #ffffff 80%, #ffffff 92%, transparent 92%);
                            background-size: 96px 96px;">
                        </div>
                        <!-- QR positioning markers -->
                        <div style="position: absolute; top: 8px; left: 8px; width: 28px; height: 28px; background-color: #1a3a6e; border: 4px solid #ffffff;"></div>
                        <div style="position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; background-color: #1a3a6e; border: 4px solid #ffffff;"></div>
                        <div style="position: absolute; bottom: 8px; left: 8px; width: 28px; height: 28px; background-color: #1a3a6e; border: 4px solid #ffffff;"></div>
                    </div>
                </div>
                <div style="font-size: 12px; color: #5a7ba7; font-weight: 500;">SCAN QR FOR DIGITAL PROFILE</div>
            </div>
            
            <!-- Footer -->
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 10px;">
                <div style="font-size: 14px; color: #5a7ba7; font-weight: 600;">UNIVERSITY OF TECHNOLOGY</div>
                <div style="font-style: italic; color: #5a7ba7; font-size: 12px;">Student Affairs Office</div>
            </div>
        </div>
        
        <!-- Magnetic strip simulation -->
        <div style="position: absolute; top: 20px; width: 100%; height: 40px; background: linear-gradient(90deg, #1a1a1a, #333333, #1a1a1a);"></div>
        
        <!-- Contact information -->
        <div style="position: absolute; bottom: 60px; left: 0; width: 100%; text-align: center; font-size: 10px; color: #5a7ba7; padding: 0 20px;">
            <div>If found, please contact Student Affairs Office: (555) 123-4567 | student.id@university.edu</div>
        </div>
        
        <!-- Link to front -->
        <a href="id-card-front.html" style="position: absolute; bottom: 20px; right: 20px; background-color: #2a6bc5; color: white; text-decoration: none; padding: 8px 16px; border-radius: 20px; font-size: 14px; cursor: pointer; transition: background-color 0.3s; z-index: 2;">
            ← VIEW FRONT
        </a>
    </div>
    
    <!-- Instructions -->
    <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); text-align: center; max-width: 540px; padding: 15px; background-color: white; border-radius: 12px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);">
        <div style="color: #1a3a6e; font-weight: 600; margin-bottom: 5px;">Modern Student ID Card - Back</div>
        <div style="color: #5a7ba7; font-size: 14px;">Click "VIEW FRONT" to return to the front side</div>
    </div>
</body>
</html>