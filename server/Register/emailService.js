import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); 

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const privacyNotice = `
<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 30px; font-size: 12px; color: #666;">
  <h4 style="color: #2d3748; margin-bottom: 10px; text-align:center;">Privacy Notice & Terms</h4>
  <p>We collect device and location data solely for your account security and privacy protection. This information is used to:</p>
  <ul style="padding-left: 20px;">
    <li>Verify login attempts and protect against unauthorized access</li>
    <li>Alert you of any suspicious activity on your account</li>
    <li>Enhance the security of your account through location-based verification</li>
  </ul>
  <p><strong>Important:</strong> We send detailed notifications for all account activities (signup, login attempts, verification requests). 
  We are not liable for any unauthorized access if you fail to monitor or act upon these security notifications.</p>
  <p>Your data protection is our priority:</p>
  <ul style="padding-left: 20px;">
    <li>We never sell, trade, or share your personal information with third parties</li>
    <li>All collected data is used strictly for security purposes</li>
    <li>Data is encrypted and stored securely following industry standards</li>
  </ul>
  <p style="margin-top: 15px; font-style: italic;">By using our service, you acknowledge these terms and agree to our security measures.</p>
</div>`;

const emailFooter = `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7;">
  <p style="color: #718096; font-size: 12px; text-align: center;">
    This is an automated security email. Please do not reply.
    <br>
    © ${new Date().getFullYear()} YourCompany. All rights reserved.
  </p>
</div>`;

export const sendVerificationCodeforSignup = async (email, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, system-ui, sans-serif; background: #f1f5f9;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="padding: 32px;">
            <div style="text-align: center;">
              <h1 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">
                Welcome!
              </h1>
              <p style="color: #475569; font-size: 16px; margin: 0 0 24px 0;">
                Use this code to verify your email
              </p>
              
              <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 0 0 24px 0;">
                <div style="font-family: monospace; font-size: 32px; font-weight: 600; color: black; letter-spacing: 4px;">
                  ${code}
                </div>
                <p style="color: #64748b; font-size: 13px; margin: 8px 0 0 0;">
                  Expires in 10 minutes
                </p>
              </div>
            </div>
          </div>
          
          ${privacyNotice}
          ${emailFooter}
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};



export const sendLoginNotification = async (email, deviceInfo, isSuccessful, errorReason = '', verificationCode = null) => {
  const { locationInfo, browserInfo, deviceInfo: deviceDetails } = deviceInfo;
  
  const statusColor = isSuccessful ? '#16a34a' : '#dc2626';
  const statusSymbol = isSuccessful ? '●' : '!';
  const getVerificationDetails = (type) => {
    switch(type) {
      case 'full_verification':
        return {
          message: 'Both your device and location are not recognized',
          isDeviceUnrecognized : !isSuccessful ? true : false,
          isLocationUnrecognized : !isSuccessful ? true : false
        };
      case 'device_verification':
        return {
          message: 'Your device is not recognized',
          isDeviceUnrecognized : !isSuccessful ? true : false,
          isLocationUnrecognized : !isSuccessful ? false : true
        };
      case 'location_verification':
        return {
          message: 'Your location is not recognized',
          isDeviceUnrecognized : !isSuccessful ? false : true,
          isLocationUnrecognized : !isSuccessful ? true : false
        };
      case 'password did not match':
        return {
          message: 'password did not match',
          isDeviceUnrecognized : false,
          isLocationUnrecognized : false
        };
      default:
        return {
          message: 'Your login has been verified successfully.',
          isDeviceUnrecognized : !isSuccessful ? true : false,
          isLocationUnrecognized : !isSuccessful ? true : false
        };
    }
  };

  const verificationDetails = getVerificationDetails(errorReason);

  console.log(verificationDetails);
  
  
  console.log(errorReason);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: isSuccessful ? 'New Sign-in' : 'Security Alert: Verification Required',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, system-ui, sans-serif; background: #f1f5f9;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="color: ${statusColor}; font-size: 24px;">${statusSymbol}</span>
              <h1 style="color: ${statusColor}; font-size: 24px; font-weight: 600; margin: 12px 0 0 0;">
                ${isSuccessful ? 'New Sign-in Detected' : 'Verification Required'}
              </h1>
            </div>

            ${!isSuccessful ? `
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin-bottom: 24px;">
              <h3 style="color: #dc2626; font-size: 16px; margin: 0 0 8px 0;">Security Notice</h3>
              <p style="color: #991b1b; font-size: 14px; margin: 0 0 12px 0;">🔒 ${verificationDetails.message}</p>
              <p style="color: #991b1b; font-size: 14px; margin: 0;">For your security, we need to verify this login attempt.</p>
            </div>
            ` : ''}

            ${verificationCode ? `
            <div style="background: #eff6ff; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
              <h3 style="color: black; font-size: 16px; margin: 0 0 12px 0;">Your Verification Code</h3>
              <div style="font-family: monospace; font-size: 32px; font-weight: 600; color: black; letter-spacing: 4px;">
                ${verificationCode}
              </div>
              <p style="color: #64748b; font-size: 13px; margin: 8px 0 0 0;">
                ⏰ Code expires in 10 minutes
              </p>
            </div>
            ` : ''}

            <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
              <h3 style="color: #2D3748; margin: 0 0 15px 0;">
                ${verificationDetails.isLocationUnrecognized ? '❌ Unrecognized Location' : '📍 Location Details'}
              </h3>
              <p style="margin: 5px 0;">
                📍 <strong>Location:</strong> ${locationInfo.city || 'Unknown City'}, ${locationInfo.region || ''}, ${locationInfo.country || 'Unknown Country'}
              </p>
              <p style="margin: 5px 0;">
                🌐 <strong>IP Address:</strong> ${locationInfo.ip || 'Unknown'}
              </p>
              <p style="margin: 5px 0;">
                🕒 <strong>Time:</strong> ${new Date().toLocaleString()}
              </p>
            </div>

            <div style="background: #f8fafc; border-radius: 8px; padding: 16px;">
              <h3 style="color: #0f172a; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
                ${verificationDetails.isDeviceUnrecognized ? '❌ Unrecognized Device' : '💻 Device Information'}
              </h3>
              <p style="margin: 5px 0;">
                💻 <strong>Device:</strong> ${deviceDetails.deviceVendor || ''} ${deviceDetails.deviceModel || ''} (${deviceDetails.deviceType || 'Unknown Device'})
              </p>
              <p style="margin: 5px 0;">
                🌐 <strong>Browser:</strong> ${browserInfo.browserName || 'Unknown'} ${browserInfo.browserVersion || ''}
              </p>
              <p style="margin: 5px 0;">
                🖥️ <strong>OS:</strong> ${deviceDetails.osName || 'Unknown'} ${deviceDetails.osVersion || ''}
              </p>
            </div>

            <div style="background-color: #EBF8FF; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #2B6CB0; margin: 0 0 15px 0;">Security Tips</h3>
              <ul style="color: #2A4365; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">If you don't recognize this activity, please change your password immediately</li>
                <li>Keep your account secure by regularly reviewing your trusted devices and locations</li>
              </ul>
            </div>
          </div>
          
          ${privacyNotice}
          ${emailFooter}
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};

export const sendVerificationSuccessEmail = async (email, deviceInfo, verificationType) => {
  const { locationInfo, browserInfo, deviceInfo: deviceDetails } = deviceInfo;
  
  const getVerificationDetails = (type) => {
    switch(type) {
      case 'full_verification':
        return {
          title: 'New Device & Location Verified Successfully',
          message: 'Your new device and location have been successfully verified and added to your trusted devices and locations.',
          showDeviceInfo : true,
          showLocationInfo : true
        };
      case 'device_verification':
        return {
          title: 'New Device Verified Successfully',
          message: 'Your new device has been successfully verified and added to your trusted devices.',
          showDeviceInfo : true,
          showLocationInfo : false
        };
      case 'location_verification':
        return {
          title: 'New Location Verified Successfully',
          message: 'Your new login location has been successfully verified and added to your trusted locations.',
          showDeviceInfo : false,
          showLocationInfo : true
        };
      default:
        return {
          title: 'Verification Successful',
          message: 'Your login has been verified successfully.',
          showDeviceInfo : true,
          showLocationInfo : true
        };
    }
  };












  const verificationDetails = getVerificationDetails(verificationType);
  

  console.log(verificationType);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `${verificationDetails.title} - Account Security Update`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 20px; font-family: -apple-system, system-ui, sans-serif; background: #f1f5f9;">
        <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <div style="padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; padding: 15px;">
                <span style="font-size: 24px;">✓</span>
              </div>
              <h1 style="color: #2C7A7B; font-size: 24px; margin: 20px 0;">
                ${verificationDetails.title}
              </h1>
            </div>

            <div style="background-color: #F0FFF4; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #48BB78;">
              <p style="color: #2F855A; margin: 0;">
                ${verificationDetails.message}
              </p>
            </div>

            <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #2D3748; margin: 0 0 15px 0;">
                ${verificationDetails.showLocationInfo ? '✅ Verified Location Details' : '📍 Location Details'}
              </h3>
              <p style="margin: 5px 0;">
                📍 <strong>Location:</strong> ${locationInfo.city || 'Unknown City'}, ${locationInfo.region || ''}, ${locationInfo.country || 'Unknown Country'}
              </p>
              <p style="margin: 5px 0;">
                🌐 <strong>IP Address:</strong> ${locationInfo.ip || 'Unknown'}
              </p>
              <p style="margin: 5px 0;">
                🕒 <strong>Time:</strong> ${new Date().toLocaleString()}
              </p>
            </div>

            <div style="background-color: #F7FAFC; padding: 20px; border-radius: 8px;">
              <h3 style="color: #2D3748; margin: 0 0 15px 0;">
                ${verificationDetails.showDeviceInfo ? '✅ Verified Device Information' : '💻 Device Information'}
              </h3>
              <p style="margin: 5px 0;">
                💻 <strong>Device:</strong> ${deviceDetails.deviceVendor || ''} ${deviceDetails.deviceModel || ''} (${deviceDetails.deviceType || 'Unknown Device'})
              </p>
              <p style="margin: 5px 0;">
                🌐 <strong>Browser:</strong> ${browserInfo.browserName || 'Unknown'} ${browserInfo.browserVersion || ''}
              </p>
              <p style="margin: 5px 0;">
                🖥️ <strong>OS:</strong> ${deviceDetails.osName || 'Unknown'} ${deviceDetails.osVersion || ''}
              </p>
            </div>

            <div style="background-color: #EBF8FF; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <h3 style="color: #2B6CB0; margin: 0 0 15px 0;">Security Tips</h3>
              <ul style="color: #2A4365; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">You'll only need to verify ${verificationType === 'new_device_and_location' ? 'this device and location' : verificationType === 'device_mismatch' ? 'this device' : 'this location'} once for future logins</li>
                <li style="margin-bottom: 8px;">If you don't recognize this activity, please change your password immediately</li>
                <li>Keep your account secure by regularly reviewing your trusted devices and locations</li>
              </ul>
            </div>
          </div>
          
          ${privacyNotice}
          ${emailFooter}
        </div>
      </body>
      </html>
    `
  };

  return transporter.sendMail(mailOptions);
};












export const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Our Community! 🎉',html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; font-family: -apple-system, system-ui, sans-serif; background: #f1f5f9;">
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="padding: 32px;">
          <div style="text-align: center;">
            <div style="width: 64px; height: 64px;  display: inline-flex; align-items: center; justify-content: center; margin: 0 auto 24px auto;">
              <span style="font-size: 32px;">👋</span>
            </div>
            
            <h1 style="color: #0f172a; font-size: 24px; font-weight: 600; margin: 0 0 8px 0;">
              Welcome${username ? ` ${username}` : ''}!
            </h1>
            
            <p style="color: #475569; font-size: 16px; margin: 0 0 24px 0;">
              We're excited to have you join our community. Your account has been successfully created and is ready to use.
            </p>
          </div>

          <div style="background: #f8fafc; border-radius: 8px; padding: 24px; margin: 0 0 24px 0;">
            <h3 style="color: #0f172a; font-size: 16px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">
              Get Started
            </h3>
            <ul style="color: #475569; font-size: 14px; margin: 0; padding: 0 0 0 20px; line-height: 1.6;">
              <li style="margin-bottom: 12px;">Complete your profile to personalize your experience</li>
              <li style="margin-bottom: 12px;">Explore our features and services</li>
              <li>Connect with other members of our community</li>
            </ul>
          </div>

          <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; text-align: center;">
            <p style="color: #166534; font-size: 14px; margin: 0;">
              Need help getting started? Check out our 
              <a href="#" style="color: #15803d; text-decoration: none; font-weight: 500;">Help Center</a> 
              or contact our support team.
            </p>
          </div>
        </div>
        
        ${privacyNotice}
        ${emailFooter}
      </div>
    </body>
    </html>
  `
};

return transporter.sendMail(mailOptions);
};