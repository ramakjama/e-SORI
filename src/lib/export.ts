'use client'

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

/**
 * Export data to PDF format
 * @param data - Array of objects to export
 * @param columns - Array of column keys to include
 * @param filename - Name of the file (without extension)
 * @param title - Optional title for the PDF header
 */
export function exportToPDF(
  data: Record<string, any>[],
  columns: string[],
  filename: string,
  title?: string
) {
  const doc = new jsPDF()

  // Add title
  const displayTitle = title || filename
  doc.setFontSize(18)
  doc.setTextColor(227, 6, 19) // Occident red color
  doc.text(displayTitle, 14, 20)

  // Add date
  doc.setFontSize(10)
  doc.setTextColor(128, 128, 128)
  doc.text(`Generado el ${new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, 14, 28)

  // Add Soriano branding
  doc.setFontSize(8)
  doc.text('Soriano Mediadores de Seguros', 14, 34)

  // Create table
  autoTable(doc, {
    startY: 40,
    head: [columns.map(col => formatColumnHeader(col))],
    body: data.map(item => columns.map(col => formatCellValue(item[col]))),
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [227, 6, 19], // Occident red
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    margin: { top: 40 },
  })

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Pagina ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  doc.save(`${filename}.pdf`)
}

/**
 * Export data to CSV format
 * @param data - Array of objects to export
 * @param columns - Array of column keys to include
 * @param filename - Name of the file (without extension)
 */
export function exportToCSV(
  data: Record<string, any>[],
  columns: string[],
  filename: string
) {
  // Create header row with formatted column names
  const header = columns.map(col => formatColumnHeader(col)).join(';')

  // Create data rows
  const rows = data.map(item =>
    columns.map(col => {
      const value = formatCellValue(item[col])
      // Escape quotes and wrap in quotes if contains special characters
      if (value.includes(';') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(';')
  )

  // Combine header and rows
  const csv = [header, ...rows].join('\n')

  // Add BOM for Excel compatibility with special characters
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })

  // Create download link
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export data to Excel-compatible format (actually CSV with proper encoding)
 * @param data - Array of objects to export
 * @param columns - Array of column keys to include
 * @param filename - Name of the file (without extension)
 */
export function exportToExcel(
  data: Record<string, any>[],
  columns: string[],
  filename: string
) {
  // Use CSV with semicolon separator for better Excel compatibility
  exportToCSV(data, columns, filename)
}

/**
 * Format column header for display
 */
function formatColumnHeader(column: string): string {
  // Convert camelCase to Title Case
  const formatted = column
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()

  // Handle common translations
  const translations: Record<string, string> = {
    'id': 'ID',
    'name': 'Nombre',
    'number': 'Numero',
    'type': 'Tipo',
    'status': 'Estado',
    'premium': 'Prima',
    'startDate': 'Fecha Inicio',
    'endDate': 'Fecha Fin',
    'nextPayment': 'Proximo Pago',
    'coverage': 'Coberturas',
    'date': 'Fecha',
    'description': 'Descripcion',
    'amount': 'Importe',
    'policyNumber': 'Numero Poliza',
  }

  return translations[column] || formatted
}

/**
 * Format cell value for export
 */
function formatCellValue(value: any): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  if (typeof value === 'number') {
    // Format currency if it looks like a price
    if (value > 10 && value < 100000) {
      return value.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' EUR'
    }
    return value.toString()
  }

  if (typeof value === 'boolean') {
    return value ? 'Si' : 'No'
  }

  // Format dates
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    try {
      const date = new Date(value)
      return date.toLocaleDateString('es-ES')
    } catch {
      return value
    }
  }

  return String(value)
}

/**
 * Translate status values
 */
export function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    'active': 'Activa',
    'pending': 'Pendiente',
    'expired': 'Expirada',
    'in_progress': 'En curso',
    'resolved': 'Resuelta',
    'rejected': 'Rechazada',
  }
  return translations[status] || status
}

/**
 * Translate policy types
 */
export function translateType(type: string): string {
  const translations: Record<string, string> = {
    'auto': 'Coche',
    'hogar': 'Hogar',
    'vida': 'Vida',
    'salud': 'Salud',
    'decesos': 'Decesos',
  }
  return translations[type] || type
}
