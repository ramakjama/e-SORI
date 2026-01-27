/**
 * Export utilities for PDF and CSV generation
 * No external dependencies - pure JavaScript implementations
 */

// ============================================
// CSV EXPORT
// ============================================

export interface CSVColumn {
  key: string
  label: string
  format?: (value: any) => string
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: CSVColumn[],
  filename: string = 'export.csv'
): void {
  if (data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Create header row
  const headers = columns.map(col => escapeCSVValue(col.label))
  const headerRow = headers.join(',')

  // Create data rows
  const dataRows = data.map(item => {
    const values = columns.map(col => {
      const value = item[col.key]
      const formatted = col.format ? col.format(value) : value
      return escapeCSVValue(formatted)
    })
    return values.join(',')
  })

  // Combine all rows
  const csv = [headerRow, ...dataRows].join('\n')

  // Create and download file
  downloadFile(csv, filename, 'text/csv;charset=utf-8;')
}

function escapeCSVValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)
  
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

// ============================================
// SIMPLE PDF EXPORT (HTML to PDF approach)
// ============================================

export interface PDFOptions {
  title?: string
  orientation?: 'portrait' | 'landscape'
  fontSize?: number
}

/**
 * Generate a simple PDF from HTML content
 * Uses browser's print functionality
 */
export function exportToPDF(
  htmlContent: string,
  filename: string = 'document.pdf',
  options: PDFOptions = {}
): void {
  const {
    title = 'Documento',
    orientation = 'portrait',
    fontSize = 12,
  } = options

  // Create a hidden iframe
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
  if (!iframeDoc) {
    console.error('Could not access iframe document')
    document.body.removeChild(iframe)
    return
  }

  // Write HTML content with styles
  iframeDoc.open()
  iframeDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @page {
            size: ${orientation};
            margin: 2cm;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: ${fontSize}px;
            line-height: 1.6;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
            font-weight: bold;
          }
          h1, h2, h3 {
            color: #E30613;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #E30613;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #666;
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        ${htmlContent}
        <div class="footer">
          <p>Generado el ${new Date().toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p>Soriano Mediadores de Seguros S.L. - www.sorianomediadores.es</p>
        </div>
      </body>
    </html>
  `)
  iframeDoc.close()

  // Wait for content to load, then print
  setTimeout(() => {
    iframe.contentWindow?.print()
    
    // Clean up after a delay
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 1000)
  }, 500)
}

/**
 * Generate PDF from table data
 */
export function exportTableToPDF<T extends Record<string, any>>(
  data: T[],
  columns: CSVColumn[],
  title: string,
  filename: string = 'table.pdf'
): void {
  if (data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Generate HTML table
  const tableHTML = `
    <div class="header">
      <h1>${title}</h1>
      <p>Total de registros: ${data.length}</p>
    </div>
    <table>
      <thead>
        <tr>
          ${columns.map(col => `<th>${col.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${data.map(item => `
          <tr>
            ${columns.map(col => {
              const value = item[col.key]
              const formatted = col.format ? col.format(value) : value
              return `<td>${formatted || '-'}</td>`
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `

  exportToPDF(tableHTML, filename, { title })
}

// ============================================
// FILE DOWNLOAD HELPER
// ============================================

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

// ============================================
// EXPORT PRESETS FOR COMMON USE CASES
// ============================================

export const exportPresets = {
  /**
   * Export policies to CSV
   */
  policiesToCSV: (policies: any[]) => {
    exportToCSV(
      policies,
      [
        { key: 'number', label: 'Número de Póliza' },
        { key: 'type', label: 'Tipo' },
        { key: 'company', label: 'Compañía' },
        { key: 'premium', label: 'Prima Anual', format: (v) => `${v}€` },
        { key: 'status', label: 'Estado' },
        { key: 'startDate', label: 'Fecha Inicio' },
        { key: 'endDate', label: 'Fecha Fin' },
      ],
      `polizas_${new Date().toISOString().split('T')[0]}.csv`
    )
  },

  /**
   * Export policies to PDF
   */
  policiesToPDF: (policies: any[]) => {
    exportTableToPDF(
      policies,
      [
        { key: 'number', label: 'Número' },
        { key: 'type', label: 'Tipo' },
        { key: 'company', label: 'Compañía' },
        { key: 'premium', label: 'Prima', format: (v) => `${v}€` },
        { key: 'status', label: 'Estado' },
      ],
      'Mis Pólizas',
      `polizas_${new Date().toISOString().split('T')[0]}.pdf`
    )
  },

  /**
   * Export payments to CSV
   */
  paymentsToCSV: (payments: any[]) => {
    exportToCSV(
      payments,
      [
        { key: 'date', label: 'Fecha' },
        { key: 'concept', label: 'Concepto' },
        { key: 'amount', label: 'Importe', format: (v) => `${v}€` },
        { key: 'status', label: 'Estado' },
        { key: 'method', label: 'Método de Pago' },
      ],
      `pagos_${new Date().toISOString().split('T')[0]}.csv`
    )
  },

  /**
   * Export claims to CSV
   */
  claimsToCSV: (claims: any[]) => {
    exportToCSV(
      claims,
      [
        { key: 'number', label: 'Número de Siniestro' },
        { key: 'policyNumber', label: 'Póliza' },
        { key: 'type', label: 'Tipo' },
        { key: 'date', label: 'Fecha' },
        { key: 'status', label: 'Estado' },
        { key: 'estimatedAmount', label: 'Importe Estimado', format: (v) => v ? `${v}€` : '-' },
      ],
      `siniestros_${new Date().toISOString().split('T')[0]}.csv`
    )
  },
}
