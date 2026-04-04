import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email configuration
const FROM_EMAIL = "Beto Altamirano <ceo@send.satechbloc.com>"
const REPLY_TO = "ceo@satechbloc.com"

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
function getEmailTemplate(content: string, footerText: string = "", eventType: "techfuel" | "techday" | "both" = "both") {
  const header = getEmailHeader(eventType)
  const dates = getEmailDates(eventType)
  const subtextLine = eventType === "both"
    ? `<p style="margin: 6px 0 0; color: rgba(255,255,255,0.5); font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">Tech Fuel 2–6 PM • Tech Day 1–4 PM (Doors Open 12:30 PM)</p>`
    : `<p style="margin: 6px 0 0;"><a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">sanantoniotechday.com</a></p>`
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
                ${header}
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.7); font-size: 14px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
                ${dates}
              </p>
              ${subtextLine}
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
      return "April 20, 2026 • 2:00–6:00 PM • UTSA SP1"
    case "techday":
      return "April 21, 2026 • 1:00–4:00 PM • Boeing Center at Tech Port"
    case "both":
      return "April 20-21, 2026 • UTSA SP1 • Boeing Center at Tech Port"
  }
}

// Get email time info for combined events
function getEmailTimeInfo(eventType: "techfuel" | "techday" | "both"): string {
  if (eventType === "both") {
    return "Tech Fuel 2:00–6:00 PM • Tech Day 1:00–4:00 PM (Doors 12:30 PM)"
  }
  return ""
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
              ${getEmailTimeInfo(eventType) ? `<p style="margin: 6px 0 0; color: rgba(255,255,255,0.5); font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: 1px;">${getEmailTimeInfo(eventType)}</p>` : ""}
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
        dateInfo: "<strong>April 20, 2026 • 2:00–6:00 PM</strong>",
        locationInfo: "<strong>UTSA SP1</strong>, San Antonio",
        scheduleLink: "https://sanantoniotechday.com/techfuel"
      }
    case "techday":
      return {
        greeting: `You're In, ${firstName}! 🎉`,
        description: "Your registration for <strong>Tech Day 2026</strong> is confirmed. We can't wait to see you at Boeing Center at Tech Port on April 21st!",
        dateInfo: "<strong>April 21, 2026 • 1:00–4:00 PM</strong><br/>Doors Open at 12:30 PM",
        locationInfo: "<strong>Boeing Center at Tech Port</strong>, San Antonio",
        scheduleLink: "https://sanantoniotechday.com/techday"
      }
    case "both":
      return {
        greeting: `You're In, ${firstName}! 🎉`,
        description: "Your registration for <strong>Tech Fuel & Tech Day 2026</strong> is confirmed. Join us for two incredible days of innovation, pitches, and networking!",
        dateInfo: "<strong>April 20-21, 2026</strong><br/>Tech Fuel: 2:00–6:00 PM • Tech Day: 1:00–4:00 PM (Doors 12:30 PM)",
        locationInfo: "<strong>UTSA SP1</strong> (April 20) & <strong>Boeing Center at Tech Port</strong> (April 21), San Antonio",
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

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
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

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
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

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Sponsor inquiry confirmation sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send sponsor inquiry confirmation to ${email}:`, error)
    return { success: false, error }
  }
}

// Zoom meeting details per date
const ZOOM_MEETINGS: Record<string, { url: string; meetingId: string; passcode: string }> = {
  "2026-04-02": {
    url: "https://us06web.zoom.us/j/84733840136?pwd=WfCT50nnaUvgGV9PwWe3zgAeM1nt5Y.1",
    meetingId: "847 3384 0136",
    passcode: "Techbloc",
  },
  "2026-04-03": {
    url: "https://us06web.zoom.us/j/81595831528?pwd=HnDxWd4sU0RoKezdGsZEaGS7Ajqmif.1",
    meetingId: "815 9583 1528",
    passcode: "Techbloc",
  },
}

// Build a Google Calendar link for the judging session
function buildCalendarLink(date: string, timeSlot: string, zoomUrl: string): string {
  // Parse the time slot: "9:00 AM - 10:30 AM"
  const [startStr, endStr] = timeSlot.split(" - ")
  const dateStr = date // "2026-04-02"

  function parseTime(dateBase: string, time: string): string {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!match) return ""
    let hours = parseInt(match[1])
    const minutes = match[2]
    const period = match[3].toUpperCase()
    if (period === "PM" && hours !== 12) hours += 12
    if (period === "AM" && hours === 12) hours = 0
    // Format: 20260402T090000 (no timezone for simplicity, use CDT)
    return `${dateBase.replace(/-/g, "")}T${String(hours).padStart(2, "0")}${minutes}00`
  }

  const start = parseTime(dateStr, startStr)
  const end = parseTime(dateStr, endStr)
  const title = encodeURIComponent("Tech Fuel 2026 Semi-Finals Judging")
  const details = encodeURIComponent(`Join via Zoom: ${zoomUrl}\n\nYou are scheduled to judge Tech Fuel semi-finalist pitches.`)
  const location = encodeURIComponent("Zoom (link in description)")

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`
}

// Judge scheduling confirmation email
export async function sendJudgeSchedulingConfirmation(
  email: string,
  judgeName: string,
  date: string,
  timeSlot: string
) {
  const zoom = ZOOM_MEETINGS[date]
  const dateLabel = date === "2026-04-02" ? "Thursday, April 2, 2026" : "Friday, April 3, 2026"
  const calendarLink = buildCalendarLink(date, timeSlot, zoom.url)

  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      You're Confirmed, ${judgeName}! 🎓
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you for volunteering to judge the <strong>Tech Fuel 2026 Semi-Finals</strong>. Your session details are below.
    </p>
    
    <!-- Session Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Semi-Finals Judging Session
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 15px;">
            <tr>
              <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${dateLabel}</p>
              </td>
              <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Time</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: 'JetBrains Mono', monospace;">${timeSlot}</p>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Judge</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${judgeName}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Zoom Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 16px; font-weight: 600;">
            📹 Zoom Meeting Details
          </h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 10px;">
                <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Join Link</p>
                <p style="margin: 0;">
                  <a href="${zoom.url}" style="color: #2563eb; text-decoration: underline; font-size: 14px; word-break: break-all;">
                    Click here to join Zoom meeting
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right: 30px;">
                      <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Meeting ID</p>
                      <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.meetingId}</p>
                    </td>
                    <td>
                      <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Passcode</p>
                      <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.passcode}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Add to Calendar -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
      <tr>
        <td align="center">
          <a href="${calendarLink}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 4px; letter-spacing: 0.5px;">
            📅 ADD TO GOOGLE CALENDAR
          </a>
        </td>
      </tr>
    </table>
    
    <h3 style="margin: 30px 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
      Session Format
    </h3>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Judge Prep (5 min)</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Brief orientation and scoring criteria review</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Startup Pitches (10 min)</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Each startup presents for ~10 minutes followed by Q&A</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Deliberation (15 min)</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Discuss startups and submit final scores</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
      Questions? Reply to this email or reach out to the Tech Bloc team.
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `Tech Fuel Judging Confirmed — ${dateLabel} at ${timeSlot} 🎓`,
      html: getEmailTemplate(content, "Save this email — it contains your Zoom details for judging day"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Judge scheduling confirmation sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send judge scheduling confirmation to ${email}:`, error)
    return { success: false, error }
  }
}

// Pitch scheduling confirmation email
export async function sendPitchSchedulingConfirmation(
  email: string,
  companyName: string,
  founderName: string,
  date: string,
  pitchSlot: string,
  judgeBlock: string
) {
  const zoom = ZOOM_MEETINGS[date]
  const dateLabel = date === "2026-04-02" ? "Thursday, April 2, 2026" : "Friday, April 3, 2026"
  const calendarLink = buildCalendarLink(date, pitchSlot, zoom.url)

  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Congratulations, ${founderName}! 🎉
    </h2>
    
    <p style="margin: 0 0 15px; color: #525252; font-size: 16px; line-height: 1.6;">
      We're excited to share that <strong>${companyName}</strong> has been selected as a <strong>Semi-Finalist</strong> for the Tech Fuel 2026 Startup Pitch Competition! Out of many impressive applications, your pitch stood out to our review panel.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Your semi-finals pitch session has been confirmed. Here are your details:
    </p>
    
    <!-- Session Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Semi-Finals Pitch Session
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 15px;">
            <tr>
              <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${dateLabel}</p>
              </td>
              <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Pitch Time</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: 'JetBrains Mono', monospace;">${pitchSlot}</p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Company</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${companyName}</p>
              </td>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Judge Block</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: 'JetBrains Mono', monospace;">${judgeBlock}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Zoom Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 16px; font-weight: 600;">
            📹 Zoom Meeting Details
          </h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 10px;">
                <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Join Link</p>
                <p style="margin: 0;">
                  <a href="${zoom.url}" style="color: #2563eb; text-decoration: underline; font-size: 14px; word-break: break-all;">
                    Click here to join Zoom meeting
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right: 30px;">
                      <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Meeting ID</p>
                      <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.meetingId}</p>
                    </td>
                    <td>
                      <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Passcode</p>
                      <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.passcode}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Add to Calendar -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
      <tr>
        <td align="center">
          <a href="${calendarLink}" target="_blank" style="display: inline-block; padding: 14px 32px; background-color: #0a0a0a; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 4px; letter-spacing: 0.5px;">
            📅 ADD TO GOOGLE CALENDAR
          </a>
        </td>
      </tr>
    </table>
    
    <h3 style="margin: 30px 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
      What to Expect
    </h3>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Join Zoom Early</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Log in 2–3 minutes before your pitch time</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Pitch (5 min)</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Present your startup to the judging panel</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Q&A (5 min)</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Judges ask follow-up questions about your startup</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
      Questions? Reply to this email or reach out to the Tech Bloc team.
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `Congratulations — ${companyName} is a Tech Fuel Semi-Finalist! 🎉 Pitch on ${dateLabel} at ${pitchSlot}`,
      html: getEmailTemplate(content, "Save this email — it contains your Zoom details and pitch time"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Pitch scheduling confirmation sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send pitch scheduling confirmation to ${email}:`, error)
    return { success: false, error }
  }
}

// Judge invitation email — directs judges to the scheduling page
export async function sendJudgeInvitationEmail(
  email: string,
  judgeName: string
) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      You're Invited to Judge, ${judgeName}! 🎓
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you for volunteering to be a judge for the <strong>Tech Fuel 2026 Semi-Finals</strong>. We're excited to have you on the panel!
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      The semi-finals will take place via <strong>Zoom</strong> on <strong>April 2–3, 2026</strong>. Each judging block is approximately 90 minutes and includes a brief orientation, startup pitches, and deliberation.
    </p>
    
    <!-- Action Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Action Required
          </p>
          
          <p style="margin: 15px 0 0; color: #ffffff; font-size: 16px; line-height: 1.6;">
            Please select your preferred judging session. Available dates and time slots are shown on the scheduling page.
          </p>
          
          <p style="margin: 15px 0 0; color: rgba(255,255,255,0.5); font-size: 13px;">
            Slots are first-come, first-served — once you select a time, it's locked in.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Schedule Button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
      <tr>
        <td align="center">
          <a href="https://sanantoniotechday.com/semifinals-judges" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #c73030; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase;">
            Schedule Your Judging Session
          </a>
        </td>
      </tr>
    </table>
    
    <h3 style="margin: 30px 0 15px; color: #0a0a0a; font-size: 18px; font-weight: 600;">
      What to Expect
    </h3>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">1</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Pick a Date &amp; Time</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Choose from available 90-minute blocks on April 2 or 3</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">2</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Receive Confirmation</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">You'll get a follow-up email with Zoom details and calendar invite</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 12px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="width: 40px; vertical-align: top;">
                <span style="display: inline-block; width: 28px; height: 28px; background-color: #c73030; border-radius: 50%; text-align: center; line-height: 28px; color: #ffffff; font-size: 14px; font-weight: 600;">3</span>
              </td>
              <td style="vertical-align: top;">
                <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 500;">Judge Day</p>
                <p style="margin: 5px 0 0; color: #737373; font-size: 14px;">Join via Zoom, review pitches, and help select the finalists</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
      Questions? Reply to this email or reach out to the Tech Bloc team.
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `You're invited to judge Tech Fuel 2026 Semi-Finals 🎓`,
      html: getEmailTemplate(content, "Please schedule your judging session at your earliest convenience"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Judge invitation email sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send judge invitation email to ${email}:`, error)
    return { success: false, error }
  }
}

// Beto Altamirano signature image URL (hosted on Firebase Storage)
// To update: upload new signature PNG to Firebase Storage and update this URL
const BETO_SIGNATURE_URL = "https://firebasestorage.googleapis.com/v0/b/groovy-ego-462522-v2.firebasestorage.app/o/signature.PNG?alt=media"

// Pitch semifinals notification email — notifies accepted pitches they're moving to semifinals
// Now includes admin-assigned date/time and Beto's signature
export async function sendPitchSemifinalsNotification(
  email: string,
  founderName: string,
  companyName: string,
  date: string,
  pitchSlot: string,
  judgeBlock: string
) {
  const zoom = ZOOM_MEETINGS[date]
  const dateLabel = date === "2026-04-02" ? "Thursday, April 2, 2026" : "Friday, April 3, 2026"

  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hey ${founderName},
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      <strong>${companyName}</strong> has been selected as a <strong>2026 TechFuel Semi-Finalist!</strong>
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We reviewed a strong pool of applicants, and your company stood out. We're looking forward to learning more about what you're building.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      As part of the next round, you'll pitch live via Zoom to a panel of five judges. The format will be a <strong>5-minute pitch</strong> followed by a <strong>5-minute Q&A</strong>.
    </p>
    
    <!-- Session Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 15px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Your Semi-Finals Interview
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Date</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${dateLabel}</p>
              </td>
              <td width="50%" style="vertical-align: top; padding-bottom: 15px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Pitch Time</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500; font-family: 'JetBrains Mono', monospace;">${pitchSlot}</p>
              </td>
            </tr>
            <tr>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Company</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">${companyName}</p>
              </td>
              <td width="50%" style="vertical-align: top;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Format</p>
                <p style="margin: 0; color: #ffffff; font-size: 15px; font-weight: 500;">5 min pitch + 5 min Q&A</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <!-- Zoom Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background-color: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 15px; color: #1e40af; font-size: 16px; font-weight: 600;">
            📹 Zoom Meeting Details
          </h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 10px;">
                <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Join Link</p>
                <p style="margin: 0;">
                  <a href="${zoom.url}" style="color: #2563eb; text-decoration: underline; font-size: 14px; word-break: break-all;">
                    Click here to join Zoom meeting
                  </a>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right: 30px;">
                      <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Meeting ID</p>
                      <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.meetingId}</p>
                    </td>
                    <td>
                      <p style="margin: 0 0 3px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Passcode</p>
                      <p style="margin: 0; color: #0a0a0a; font-size: 14px; font-family: 'JetBrains Mono', monospace; font-weight: 500;">${zoom.passcode}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      If you have any questions, feel free to reply directly to this email.
    </p>
    
    <p style="margin: 0 0 10px; color: #525252; font-size: 16px; line-height: 1.6;">
      We look forward to your pitch.
    </p>
    
    <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">
      Best,
    </p>
    
    <!-- Beto Signature -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
      <tr>
        <td>
          <img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
          <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
        </td>
      </tr>
    </table>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `TechFuel 2026: Update Regarding Your Application`,
      html: getEmailTemplate(content, "Save this email — it contains your Zoom details and pitch time", "techfuel"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Pitch semifinals notification sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send pitch semifinals notification to ${email}:`, error)
    return { success: false, error }
  }
}

// Ecosystem Tours notification email — one-time email to early registrants (Feb 5-23)
export async function sendEcosystemToursNotification(
  email: string,
  firstName: string,
  events: string[]
) {
  const eventType = getEventType(events)

  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      New Addition to Tech Fuel, ${firstName}! 🚌
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Since you registered, we've added something new to <strong>Tech Fuel 2026</strong> — <strong>Ecosystem Tours</strong>, running throughout the day on April 20th at UTSA SP1.
    </p>
    
    <!-- Tour Info Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.08; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 5px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Ecosystem Tours
          </p>
          <p style="margin: 0 0 20px; color: #ffffff; font-size: 20px; font-weight: 600;">
            Go behind the scenes
          </p>
          <p style="margin: 0 0 15px; color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.7;">
            This year, we're placing attendees directly inside the facilities shaping San Antonio's most strategic industry clusters. Our tours visit two landmark sites:
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 15px;">
            <tr>
              <td style="padding-bottom: 20px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Stop 1</p>
                <p style="margin: 0 0 5px; color: #ffffff; font-size: 15px; font-weight: 600;">Port San Antonio</p>
                <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.5;">1,900-acre campus — cyber, aerospace & advanced manufacturing</p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 5px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Stop 2</p>
                <p style="margin: 0 0 5px; color: #ffffff; font-size: 15px; font-weight: 600;">VelocityTX</p>
                <p style="margin: 0; color: rgba(255,255,255,0.6); font-size: 13px; line-height: 1.5;">Bioscience innovation campus — translational research & commercialization</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Ecosystem tours are <strong>included with your Tech Fuel registration</strong> — you just need to opt in. It takes 30 seconds.
    </p>
    
    <!-- CTA Button -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 25px 0;">
      <tr>
        <td align="center">
          <a href="https://sanantoniotechday.com/ecosystem-tours" target="_blank" style="display: inline-block; padding: 16px 40px; background-color: #c73030; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; border-radius: 4px; letter-spacing: 0.5px; text-transform: uppercase;">
            Add Ecosystem Tours
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 30px 0 0; color: #a3a3a3; font-size: 14px; line-height: 1.6;">
      Already opted in? No action needed. Questions? Reply to this email or reach out to the Tech Bloc team.
    </p>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `New: Ecosystem Tours added to Tech Fuel 2026 🚌`,
      html: getEventEmailTemplate(content, eventType, "Ecosystem tours are included with your Tech Fuel registration"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Ecosystem tours notification sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send ecosystem tours notification to ${email}:`, error)
    return { success: false, error }
  }
}

// Pitch non-select notification email — notifies pitch applicants they were not selected for semifinals
export async function sendPitchNonSelectNotification(
  email: string,
  founderName: string,
  companyName: string
) {
  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hey ${founderName},
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you for taking the time to apply and engage with us for Tech Fuel 2026. We truly appreciate the effort that goes into building and sharing what you're working on.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      After a highly competitive review process, <strong>${companyName}</strong> was not selected to advance to the next stage this year. This was not an easy decision. We received a strong pool of applications and, with limited spots, had to make difficult choices across a range of factors.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      This outcome does not diminish the quality of what you're building or the potential ahead. Many of the founders in our ecosystem have applied more than once, and we've seen firsthand the progress teams make between cycles. We encourage you to keep building, validating your assumptions, and gaining traction—and to consider applying again next year.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      In the meantime, we'd love to stay connected. We hope you'll join us at the Tech Fuel Finals on April 20 at the UTSA School of Data Science. It will be a strong gathering of investors, founders, and community leaders. We're also hosting Tech Day on April 21, which is designed to bring the broader innovation ecosystem together.
    </p>
    
    <!-- Register CTA -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
      <tr>
        <td align="center">
          <a href="https://sanantoniotechday.com/register" style="display: inline-block; background-color: #c73030; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 14px 32px; border-radius: 6px; letter-spacing: 0.5px;">
            Get Your Tickets
          </a>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you again for considering Tech Fuel and for the work you're doing. We're rooting for your continued progress and hope to stay in touch.
    </p>
    
    <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">
      Best,
    </p>
    
    <!-- Beto Signature -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
      <tr>
        <td>
          <img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
          <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
        </td>
      </tr>
    </table>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: `TechFuel 2026: Update Regarding Your Application`,
      html: getEmailTemplate(content, "", "techfuel"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Pitch non-select notification sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send pitch non-select notification to ${email}:`, error)
    return { success: false, error }
  }
}

// Send finalist notification email
export async function sendFinalistNotification(
  email: string,
  founderName: string,
  companyName: string
) {
  const firstName = founderName.split(" ")[0]
  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hi ${firstName},
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Congratulations — <strong>${companyName}</strong> has advanced to the <strong>TechFuel 2026 FINALS!</strong>
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Out of more than 75 applicants, we selected 25 semifinalists, and from that group, you've earned a spot as one of the top 5 startups. That's a significant accomplishment and a reflection of the strength of what you're building. You should be proud of the work that got you here.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We were impressed by your pitch and are excited to have you present in person on April 20th. You've earned it.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      &#128274; <strong>Please keep this confidential until Tuesday, April 7th.</strong>
    </p>
    
    <p style="margin: 0 0 30px; color: #525252; font-size: 16px; line-height: 1.6;">
      We'll be announcing all finalists across our social channels that day. Once live, we encourage you to share widely.
    </p>
    
    <!-- What's Next Header -->
    <h3 style="margin: 0 0 25px; color: #0a0a0a; font-size: 20px; font-weight: 700; border-bottom: 2px solid #c73030; padding-bottom: 10px;">
      What's Next
    </h3>
    
    <!-- Pitch Bootcamp Card -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #0a0a0a; border-radius: 8px; padding: 30px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -10px; right: -10px; opacity: 0.1; transform: rotate(45deg);">
            ${DOWN_ARROW_SVG}
          </div>
          
          <p style="margin: 0 0 8px; color: #c73030; font-size: 11px; font-family: 'JetBrains Mono', monospace; letter-spacing: 2px; text-transform: uppercase;">
            Tech Bloc &bull; Geekdom
          </p>
          <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 18px; font-weight: 600;">
            Pitch Bootcamp (April 10–12)
          </h3>
          
          <p style="margin: 0 0 20px; color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.6;">
            Please make arrangements to block this in your schedule. In partnership with Geekdom, all finalists will participate in a focused weekend to sharpen your pitch and prepare for the stage:
          </p>
          
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding-bottom: 12px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Friday (Evening)</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">Welcome dinner with finalists and key community stakeholders</p>
              </td>
            </tr>
            <tr>
              <td style="padding-bottom: 12px;">
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Saturday (Workshop Day @ Geekdom)</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">Pitch practice, live feedback, storytelling and stage presence sessions, and 1:1 coaching with mentors</p>
              </td>
            </tr>
            <tr>
              <td>
                <p style="margin: 0 0 3px; color: rgba(255,255,255,0.5); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Sunday (Brunch)</p>
                <p style="margin: 0; color: #ffffff; font-size: 14px;">"Fuel Up" closing brunch with finalists, mentors, and ecosystem leaders, including quick pitches from each team</p>
              </td>
            </tr>
          </table>
          
          <p style="margin: 15px 0 0; color: rgba(255,255,255,0.5); font-size: 13px; font-style: italic;">
            More details to follow shortly.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Final Pitch Deck -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 16px; font-weight: 600;">
            Final Pitch Deck
          </h3>
          <p style="margin: 0 0 8px; color: #525252; font-size: 15px; line-height: 1.6;">
            Please submit your final pitch deck by <strong>April 16 at 11:00 PM</strong>. All decks will be compiled into a master presentation.
          </p>
          <p style="margin: 0; color: #525252; font-size: 15px; line-height: 1.6;">
            Send your deck to <a href="mailto:ceo@satechbloc.com" style="color: #c73030; text-decoration: none; font-weight: 500;">ceo@satechbloc.com</a>
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Day-of Details -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 16px; font-weight: 600;">
            Day-of Details
          </h3>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Plan to arrive at the <strong>UTSA San Pedro I Weston Conference Center</strong> by <strong>1:00 PM on April 20</strong> for walkthrough and AV check.
          </p>
          <p style="margin: 0 0 15px; color: #525252; font-size: 15px; line-height: 1.6;">
            Fiesta San Antonio will be in full swing, so please allow additional time for travel and parking to ensure an on-time arrival. Recommended parking options include the <strong>SP1 lot on Dolorosa</strong> or the <strong>City of San Antonio garage on Houston</strong>. Availability is not guaranteed, so please plan accordingly.
          </p>
          <p style="margin: 0; color: #525252; font-size: 15px; line-height: 1.6;">
            A "Know Before You Go" will be sent at least 48 hours in advance. Please check your spam folder or follow up directly with <a href="mailto:nichole@434media.com" style="color: #c73030; text-decoration: none; font-weight: 500;">nichole@434media.com</a>.
          </p>
        </td>
      </tr>
    </table>
    
    <!-- Audience Vote -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px;">
          <h3 style="margin: 0 0 12px; color: #0a0a0a; font-size: 16px; font-weight: 600;">
            Audience Vote
          </h3>
          <p style="margin: 0 0 8px; color: #525252; font-size: 15px; line-height: 1.6;">
            3rd and 4th place may be determined by live audience vote. We encourage you to invite your network:
          </p>
          <p style="margin: 0;">
            <a href="https://sanantoniotechday.com" style="color: #c73030; text-decoration: none; font-weight: 500; font-size: 15px;">sanantoniotechday.com</a>
          </p>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      We'll be in close touch with more details soon. In the meantime, don't hesitate to reach out with any questions.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Congratulations again — see you at the finals.
    </p>
    
    <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">
      Keep building,
    </p>
    
    <!-- Beto Signature -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
      <tr>
        <td>
          <img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
          <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
        </td>
      </tr>
    </table>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: "TechFuel 2026: Semifinal Results",
      html: getEmailTemplate(content, "", "techfuel"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Finalist notification sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send finalist notification to ${email}:`, error)
    return { success: false, error }
  }
}

export async function sendNonFinalistNotification(
  email: string,
  founderName: string,
  companyName: string
) {
  const firstName = founderName.split(" ")[0]
  const content = `
    <h2 style="margin: 0 0 20px; color: #0a0a0a; font-size: 24px; font-weight: 600;">
      Hi ${firstName},
    </h2>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you for being part of TechFuel 2026. Out of more than 75 applicants, you advanced to the top 25 semifinalists. That is a meaningful accomplishment, and <strong>${companyName}</strong> made a strong impression on our judges.
    </p>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      After careful deliberation, we've selected our finalists for the April 20th event. While <strong>${companyName}</strong> will not be moving forward this round, we hope the experience was valuable and energizing. We have no doubt you are building something meaningful, and this is just one step in a much longer journey.
    </p>
    
    <p style="margin: 0 0 30px; color: #525252; font-size: 16px; line-height: 1.6;">
      The San Antonio tech community is stronger because of founders like you who show up, pitch, and put their work out there. That takes courage, and we respect it.
    </p>
    
    <!-- Keep in Mind Header -->
    <h3 style="margin: 0 0 25px; color: #0a0a0a; font-size: 20px; font-weight: 700; border-bottom: 2px solid #c73030; padding-bottom: 10px;">
      A few things to keep in mind
    </h3>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 30px;">
      <tr>
        <td style="padding: 0 0 16px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px; color: #c73030; font-size: 18px; font-weight: 700;">•</td>
              <td style="color: #525252; font-size: 15px; line-height: 1.6;">
                We would love to stay connected. Tech Fuel is more than a competition, and we hope this is just the beginning of your relationship with the community.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 16px 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px; color: #c73030; font-size: 18px; font-weight: 700;">•</td>
              <td style="color: #525252; font-size: 15px; line-height: 1.6;">
                We will be sharing feedback from our judges soon, and we are happy to pass along notes that may be helpful as you continue to grow.
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding: 0;">
          <table role="presentation" cellspacing="0" cellpadding="0">
            <tr>
              <td style="vertical-align: top; padding-right: 12px; color: #c73030; font-size: 18px; font-weight: 700;">•</td>
              <td style="color: #525252; font-size: 15px; line-height: 1.6;">
                We encourage you to stay engaged with Tech Bloc's programming. I competed in Tech Fuel in 2019 and did not make it to the finals, but staying connected to the community created opportunities and growth that extended far beyond the competition. I encourage you to do the same.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0 0 20px; color: #525252; font-size: 16px; line-height: 1.6;">
      Thank you again for trusting us with your story.
    </p>
    
    <p style="margin: 0 0 5px; color: #525252; font-size: 16px; line-height: 1.6;">
      Keep building,
    </p>
    
    <!-- Beto Signature -->
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 20px 0 0;">
      <tr>
        <td>
          <img src="${BETO_SIGNATURE_URL}" alt="Beto Altamirano signature" width="180" style="display: block; max-width: 180px; height: auto;" />
        </td>
      </tr>
      <tr>
        <td style="padding-top: 10px;">
          <p style="margin: 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Beto Altamirano</p>
          <p style="margin: 3px 0 0; color: #737373; font-size: 14px;">CEO, Tech Bloc</p>
        </td>
      </tr>
    </table>
  `

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO,
      subject: "TechFuel 2026: Semifinal Results",
      html: getEmailTemplate(content, "", "techfuel"),
    })

    if (result.error) {
      console.error(`Resend API error for ${email}:`, result.error)
      return { success: false, error: result.error }
    }
    console.log(`Non-finalist notification sent to ${email}:`, result)
    return { success: true, data: result }
  } catch (error) {
    console.error(`Failed to send non-finalist notification to ${email}:`, error)
    return { success: false, error }
  }
}
