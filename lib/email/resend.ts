import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
const FROM_EMAIL = "San Antonio Tech Day <noreply@send.devsa.community>"
const REPLY_TO = "build@434media.com"

// Down arrow SVG for email styling (base64 encoded for email compatibility)
const DOWN_ARROW_SVG = `<svg width="48" height="48" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="opacity: 0.15;">
  <rect x="45" y="5" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="15" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="25" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="35" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="45" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="55" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="65" width="10" height="10" fill="#c73030"/>
  <rect x="35" y="65" width="10" height="10" fill="#c73030"/>
  <rect x="25" y="55" width="10" height="10" fill="#c73030"/>
  <rect x="55" y="65" width="10" height="10" fill="#c73030"/>
  <rect x="65" y="55" width="10" height="10" fill="#c73030"/>
  <rect x="45" y="75" width="10" height="10" fill="#c73030"/>
</svg>`

// Base email template with Tech Day branding
function getEmailTemplate(content: string, footerText: string = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tech Day 2026</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header with Down Arrow -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
              <!-- Down Arrow Decoration -->
              <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">
                ${DOWN_ARROW_SVG}
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                TECH FUEL • TECH DAY <span style="color: #c73030;">2026</span>
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
                April 20-21, 2026 • UTSA SP1 • Tech Port
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 30px 40px; text-align: center;">
              ${footerText ? `<p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 13px;">${footerText}</p>` : ""}
              <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">
                © 2026 Tech Bloc & 434 MEDIA • San Antonio, TX
              </p>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.4); font-size: 11px;">
                <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none;">sanantoniotechday.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Helper to determine event type from events array
function getEventType(events: string[]): "techfuel" | "techday" | "both" {
  const hasTechFuel = events.includes("techfuel")
  const hasTechDay = events.includes("techday")
  const has2Day = events.includes("2day")
  
  if (has2Day || (hasTechFuel && hasTechDay)) {
    return "both"
  } else if (hasTechFuel) {
    return "techfuel"
  } else {
    return "techday"
  }
}

// Get email header based on event type
function getEmailHeader(eventType: "techfuel" | "techday" | "both"): string {
  switch (eventType) {
    case "techfuel":
      return "TECH FUEL <span style=\"color: #c73030;\">2026</span>"
    case "techday":
      return "TECH DAY <span style=\"color: #c73030;\">2026</span>"
    case "both":
      return "TECH FUEL • TECH DAY <span style=\"color: #c73030;\">2026</span>"
  }
}

// Get email dates based on event type
function getEmailDates(eventType: "techfuel" | "techday" | "both"): string {
  switch (eventType) {
    case "techfuel":
      return "April 20, 2026 • UTSA SP1"
    case "techday":
      return "April 21, 2026 • Tech Port"
    case "both":
      return "April 20-21, 2026 • UTSA SP1 • Tech Port"
  }
}

// Get dynamic email template with event-specific branding
function getEventEmailTemplate(content: string, eventType: "techfuel" | "techday" | "both", footerText: string = "") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${eventType === "techfuel" ? "Tech Fuel" : eventType === "techday" ? "Tech Day" : "Tech Fuel & Tech Day"} 2026</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafafa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header with Down Arrow -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 40px 40px 30px; text-align: center; position: relative;">
              <!-- Down Arrow Decoration -->
              <div style="position: absolute; top: 20px; right: 20px; opacity: 0.15;">
                ${DOWN_ARROW_SVG}
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                ${getEmailHeader(eventType)}
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
                ${getEmailDates(eventType)}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 30px 40px; text-align: center;">
              ${footerText ? `<p style="margin: 0 0 15px; color: rgba(255,255,255,0.7); font-size: 13px;">${footerText}</p>` : ""}
              <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 12px;">
                © 2026 Tech Bloc & 434 MEDIA • San Antonio, TX
              </p>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.4); font-size: 11px;">
                <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none;">sanantoniotechday.com</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Get event-specific registration message
function getRegistrationMessage(eventType: "techfuel" | "techday" | "both", firstName: string): { greeting: string; description: string; dateInfo: string; locationInfo: string; scheduleLink: string } {
  switch (eventType) {
    case "techfuel":
      return {
        greeting: `You're In, ${firstName}! 🎉`,
        description: "Your registration for <strong>Tech Fuel 2026</strong> is confirmed. Get ready to witness the most exciting startup pitch competition in San Antonio!",
        dateInfo: "<strong>April 20, 2026</strong>",
        locationInfo: "<strong>UTSA SP1</strong>, San Antonio",
        scheduleLink: "https://sanantoniotechday.com/techfuel"
      }
    case "techday":
      return {
        greeting: `You're In, ${firstName}! 🎉`,
        description: "Your registration for <strong>Tech Day 2026</strong> is confirmed. We can't wait to see you at Tech Port on April 21st!",
        dateInfo: "<strong>April 21, 2026</strong>",
        locationInfo: "<strong>Tech Port</strong>, San Antonio",
        scheduleLink: "https://sanantoniotechday.com/techday"
      }
    case "both":
      return {
        greeting: `You're In, ${firstName}! 🎉`,
        description: "Your registration for <strong>Tech Fuel & Tech Day 2026</strong> is confirmed. Join us for two incredible days of innovation, pitches, and networking!",
        dateInfo: "<strong>April 20-21, 2026</strong>",
        locationInfo: "<strong>UTSA SP1</strong> (April 20) & <strong>Tech Port</strong> (April 21), San Antonio",
        scheduleLink: "https://sanantoniotechday.com/"
      }
  }
}

// Get event display name for ticket
function getEventDisplayName(eventType: "techfuel" | "techday" | "both"): string {
  switch (eventType) {
    case "techfuel":
      return "TECH FUEL 2026"
    case "techday":
      return "TECH DAY 2026"
    case "both":
      return "TECH FUEL & TECH DAY 2026"
  }
}

// Registration confirmation email
export async function sendRegistrationConfirmation(
  email: string,
  firstName: string,
  lastName: string,
  ticketId: string,
  category: string,
  events: string[] = ["techday"],
  ecosystemTours: boolean = false
) {
  const eventType = getEventType(events)
  const message = getRegistrationMessage(eventType, firstName)
  const eventDisplayName = getEventDisplayName(eventType)
  
  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      ${message.greeting}
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      ${message.description}
    </p>
    
    <!-- Ticket Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <!-- Decorative Arrow -->
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            ${eventDisplayName}
          </p>
          <p style="margin: 0 0 5px; color: rgba(255,255,255,0.5); font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Your Ticket ID
          </p>
          <p style="margin: 0 0 20px; color: #ffffff; font-size: 28px; font-weight: 700; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px;">
            ${ticketId}
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Attendee</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${firstName} ${lastName}</p>
              </td>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Category</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; text-transform: capitalize;">${category}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <h3 style="margin: 30px 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
      What's Next?
    </h3>
    
    <ul style="margin: 0; padding: 0 0 0 20px; color: #525252; font-size: 15px; line-height: 1.8;">
      <li>Save the date: ${message.dateInfo}</li>
      <li>Location: ${message.locationInfo}</li>
      <li>Bring this email or your ticket ID for check-in</li>
      <li>Check the schedule at <a href="${message.scheduleLink}" style="color: #c73030; text-decoration: none;">sanantoniotechday.com</a></li>
    </ul>
    
    ${ecosystemTours ? `
    <!-- Ecosystem Tours Section -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.08; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            You're signed up
          </p>
          <p style="margin: 0 0 15px; color: #ffffff; font-size: 20px; font-weight: 600;">
            🚌 Ecosystem Tours
          </p>
          <p style="margin: 0 0 15px; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6;">
            This year, we're placing attendees directly inside the environments shaping San Antonio and South Texas' emerging industry clusters. Our ecosystem tours will begin at <strong style="color: #ffffff;">Port San Antonio</strong>—a 20-year industrial redevelopment now serving as one of the nation's leading hubs for cyber, aerospace, and advanced manufacturing—followed by a visit to <strong style="color: #ffffff;">VelocityTX</strong>, an internationally recognized bioscience innovation campus purpose-built to accelerate translational research and commercialization.
          </p>
          <p style="margin: 0; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6;">
            Together, these redeveloped assets reflect a coordinated regional strategy to advance innovation across both industrial and life sciences domains—spanning cyber, aerospace, advanced manufacturing, and bioscience. This integrated approach positions San Antonio as one of the few U.S. markets capable of supporting the development and dual-use commercialization of technologies across both defense and civilian applications.
          </p>
        </td>
      </tr>
    </table>
    ` : ''}

    <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
      Questions? Reply to this email or reach out on social media.
    </p>
  `

  // Dynamic subject line based on event type
  const subjectEventName = eventType === "techfuel" ? "Tech Fuel" : eventType === "techday" ? "Tech Day" : "Tech Fuel & Tech Day"
  const subject = `You're registered for ${subjectEventName} 2026! 🎟️ ${ticketId}`

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject,
      html: getEventEmailTemplate(content, eventType, "Keep this email - you'll need your ticket ID for check-in"),
    })

    console.log(`Registration confirmation sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send registration confirmation to ${email}:`, error)
    return { success: false, error }
  }
}

// Pitch submission confirmation email
export async function sendPitchConfirmation(
  email: string,
  founderName: string,
  companyName: string,
  submissionId: string
) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Pitch Received! 🚀
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Hey ${founderName}, thanks for submitting <strong>${companyName}</strong> to Tech Fuel! Your pitch is now in our review queue.
    </p>
    
    <!-- Status Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <!-- Decorative Arrow -->
          <div style="position: absolute; bottom: -15px; left: -15px; opacity: 0.08; transform: rotate(-45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td>
                <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
                  Submission ID
                </p>
                <p style="margin: 0 0 20px; color: #ffffff; font-size: 18px; font-weight: 600; font-family: 'JetBrains Mono', monospace;">
                  ${submissionId.slice(0, 12)}...
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background-color: rgba(199, 48, 48, 0.2); border-radius: 20px; padding: 8px 16px;">
                      <span style="color: #c73030; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        ⏳ Under Review
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <h3 style="margin: 30px 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
      What Happens Next?
    </h3>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Review Period</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Our team will review your pitch within 2 weeks</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Selection Notification</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Selected founders will receive pitch slot details</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 15px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Pitch Day</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Present to investors & industry leaders at Tech Day 2026</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
      While you wait, make sure to <a href="https://sanantoniotechday.com/register" style="color: #c73030; text-decoration: none;">register for Tech Day</a> if you haven't already!
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `Pitch received: ${companyName} 🚀`,
      html: getEmailTemplate(content, "We'll be in touch within 2 weeks with next steps"),
    })

    console.log(`Pitch confirmation sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send pitch confirmation to ${email}:`, error)
    return { success: false, error }
  }
}

// Sponsor inquiry confirmation email
export async function sendSponsorInquiryConfirmation(
  email: string,
  firstName: string,
  lastName: string,
  company: string
) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Thanks for Reaching Out, ${firstName}! 🤝
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We've received your sponsorship inquiry from <strong>${company}</strong> and our partnerships team is excited to connect with you.
    </p>
    
    <p style="margin: 0 0 25px; color: #525252; font-size: 16px; line-height: 1.6;">
      Tech Day is San Antonio's premier technology conference — and sponsors like you help us bring the community together, fuel innovation, and make it all possible.
    </p>
    
    <!-- Sponsorship Info Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <!-- Decorative Arrow -->
          <div style="position: absolute; bottom: -15px; right: -15px; opacity: 0.08; transform: rotate(-45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Sponsorship Inquiry
          </p>
          <p style="margin: 0 0 20px; color: #ffffff; font-size: 20px; font-weight: 600;">
            ${company}
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Contact</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${firstName} ${lastName}</p>
              </td>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Status</p>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="background-color: rgba(199, 48, 48, 0.2); border-radius: 20px; padding: 4px 12px;">
                      <span style="color: #c73030; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                        Received
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <h3 style="margin: 30px 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
      What Happens Next?
    </h3>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Inquiry Received</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Our partnerships team has your details and message</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 15px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Personal Follow-Up</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">A team member will reach out to discuss sponsorship tiers and benefits</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 15px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Partnership Finalized</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Get your brand in front of 500+ technologists at Tech Day 2026</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
      In the meantime, check out <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none;">sanantoniotechday.com</a> to learn more about what we're building in San Antonio.
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `Sponsorship inquiry received — ${company} 🤝`,
      html: getEmailTemplate(content, "Our partnerships team will be in touch soon"),
    })

    console.log(`Sponsor inquiry confirmation sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send sponsor inquiry confirmation to ${email}:`, error)
    return { success: false, error }
  }
}
