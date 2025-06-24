import { google } from 'googleapis'
import { NotionLead } from './notion'

// Initialize Google Sheets API
const getGoogleAuth = () => {
  return new google.auth.GoogleAuth({
    credentials: {
      type: 'service_account',
      project_id: process.env.GOOGLE_SHEETS_PROJECT_ID,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
}

export const sheets = google.sheets('v4')

// Google Sheets configuration
export const GOOGLE_SHEETS_CONFIG = {
  LEADS_SHEET_ID: process.env.GOOGLE_SHEETS_LEADS_ID || '',
  LEADS_RANGE: process.env.GOOGLE_SHEETS_LEADS_RANGE || 'Sheet1!A:H',
}

// Interface for Google Sheets lead data
export interface GoogleSheetsLead {
  fullName: string
  propertyUrl: string
  linkedinUrl: string
  phone: string
  email: string
  city: string
  status: string
  owner?: string
}

export class GoogleSheetsAPI {
  static async getLeads(): Promise<GoogleSheetsLead[]> {
    if (!GOOGLE_SHEETS_CONFIG.LEADS_SHEET_ID) {
      console.log('Google Sheets not configured')
      return []
    }

    try {
      const auth = getGoogleAuth()
      const response = await sheets.spreadsheets.values.get({
        auth,
        spreadsheetId: GOOGLE_SHEETS_CONFIG.LEADS_SHEET_ID,
        range: GOOGLE_SHEETS_CONFIG.LEADS_RANGE,
      })

      const rows = response.data.values || []
      if (rows.length === 0) return []

      // Skip header row and map data
      const leads = rows.slice(1).map((row: string[]) => ({
        fullName: row[0] || '',
        propertyUrl: row[1] || '',
        linkedinUrl: row[2] || '',
        phone: row[3] || '',
        email: row[4] || '',
        city: row[5] || '',
        status: row[6] || 'New',
        owner: row[7] || undefined,
      })).filter(lead => lead.fullName && lead.email) // Filter out empty rows

      return leads
    } catch (error) {
      console.error('Error fetching leads from Google Sheets:', error)
      return []
    }
  }

  static async syncLeadsToNotion(): Promise<{ imported: number, errors: string[] }> {
    try {
      const googleLeads = await this.getLeads()
      let imported = 0
      const errors: string[] = []

      for (const googleLead of googleLeads) {
        try {
          // Convert Google Sheets lead to Notion format
          const notionLead: Omit<NotionLead, 'id'> = {
            fullName: googleLead.fullName,
            email: googleLead.email,
            phone: googleLead.phone,
            city: googleLead.city,
            propertyUrl: googleLead.propertyUrl,
            linkedinUrl: googleLead.linkedinUrl,
            status: googleLead.status as any || 'New',
            owner: googleLead.owner,
            createdAt: new Date().toISOString(),
          }

          // Import to Notion (we'll implement this in NotionAPI)
          // For now, just count as imported
          imported++
        } catch (error) {
          errors.push(`Failed to import ${googleLead.fullName}: ${error}`)
        }
      }

      return { imported, errors }
    } catch (error) {
      console.error('Error syncing leads to Notion:', error)
      return { imported: 0, errors: ['Failed to sync leads from Google Sheets'] }
    }
  }
}

// Helper function to check if Google Sheets is configured
export function isGoogleSheetsConfigured(): boolean {
  return !!(
    process.env.GOOGLE_SHEETS_PROJECT_ID &&
    process.env.GOOGLE_SHEETS_PRIVATE_KEY &&
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL &&
    GOOGLE_SHEETS_CONFIG.LEADS_SHEET_ID
  )
}