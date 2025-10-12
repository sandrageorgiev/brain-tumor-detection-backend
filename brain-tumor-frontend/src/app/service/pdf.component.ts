import {Component, Input} from '@angular/core';

// Import the default builds (important!)
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {Download, Eye, LucideAngularModule} from "lucide-angular";
import {Result} from "./result.service";

// Attach fonts to the instance
pdfMake.vfs = pdfFonts.vfs;

@Component({
  selector: 'app-pdf-generator',
  standalone: true,
  imports: [
    LucideAngularModule
  ],
  template: `
    <div class="flex space-x-2">
    <button (click)="generatePDF()" class="text-blue-600 hover:text-blue-900 transition-colors" title="View Details">
      <lucide-icon [img]="Eye" class="w-4 h-4"></lucide-icon>
    </button>
    <button (click)="downloadPDF()" class="text-gray-600 hover:text-gray-900 transition-colors" title="Download Report">
      <lucide-icon [img]="Download" class="w-4 h-4"></lucide-icon>
    </button>
    </div>
  `
})
export class PdfGeneratorComponent {

  @Input() result: Result | null = null;

  generatePDF() {
    console.log('Generating PDF with result:', this.result); // Debug log

    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      content: [
        // Header with gradient styling
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 60,
              linearGradient: ['#2563eb', '#7c3aed'], // Blue to purple gradient
            }
          ]
        },
        {
          text: 'NeuroScan AI - Brain Tumor Detection Report',
          style: 'mainHeader',
          color: 'white',
          alignment: 'center',
          margin: [0, -45, 0, 0] // Adjusted negative margin for smaller height
        },

        { text: '', margin: [0, 25] }, // Spacer

        // Patient Information Section
        {
          text: 'Patient Information',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'modernSection',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                [
                  { text: 'Name:', style: 'fieldLabel' },
                  { text: this.result?.patient?.name || 'N/A', style: 'fieldValue' }
                ],
                [
                  { text: 'Surname:', style: 'fieldLabel' },
                  { text: this.result?.patient?.surname || 'N/A', style: 'fieldValue' }
                ]
              ],
              [
                [
                  { text: 'Patient ID:', style: 'fieldLabel' },
                  { text: this.result?.patient?.id || 'N/A', style: 'fieldValue' }
                ],
                [
                  { text: 'EMBG:', style: 'fieldLabel' },
                  { text: this.result?.patient?.embg || 'N/A', style: 'fieldValue' }
                ]
              ],
              [
                [
                  { text: 'Email:', style: 'fieldLabel' },
                  { text: this.result?.patient?.email || 'N/A', style: 'fieldValue' }
                ],
                [
                  { text: 'Report Date:', style: 'fieldLabel' },
                  { text: this.result?.date ? new Date(this.result.date).toLocaleDateString() : 'N/A', style: 'fieldValue' }
                ]
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 15,
            paddingRight: () => 15,
            paddingTop: () => 10,
            paddingBottom: () => 10
          }
        },

        { text: '', margin: [0, 20] }, // Spacer

        // Medical Professional Section
        {
          text: 'Medical Professional',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'modernSection',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                [
                  { text: 'Doctor:', style: 'fieldLabel' },
                  { text: `Dr. ${this.result?.doctor?.name || 'N/A'} ${this.result?.doctor?.surname || ''}`, style: 'fieldValue' }
                ],
                [
                  { text: 'Doctor ID:', style: 'fieldLabel' },
                  { text: this.result?.doctor?.id || 'N/A', style: 'fieldValue' }
                ]
              ],
              [
                [
                  { text: 'Email:', style: 'fieldLabel' },
                  { text: this.result?.doctor?.email || 'N/A', style: 'fieldValue' }
                ],
                { text: '', style: 'fieldValue' } // Empty cell
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 15,
            paddingRight: () => 15,
            paddingTop: () => 10,
            paddingBottom: () => 10
          }
        },

        { text: '', margin: [0, 20] }, // Spacer

        // Analysis Results Section - Most Important
        {
          text: 'Analysis Results',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'resultsSection',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                [
                  { text: 'Classification:', style: 'resultLabel' },
                  { text: this.result?.classification || 'N/A', style: 'resultValue' }
                ],
                [
                  { text: 'Confidence Level:', style: 'resultLabel' },
                  { text: this.result?.confidence ? (this.result.confidence * 100).toFixed(2) + '%' : 'N/A', style: 'resultValue' }
                ]
              ],
              [
                [
                  { text: 'Analysis Date:', style: 'resultLabel' },
                  { text: this.result?.date ? new Date(this.result.date).toLocaleDateString() : 'N/A', style: 'resultValue' }
                ],
                [
                  { text: 'Report ID:', style: 'resultLabel' },
                  { text: this.result?.id || 'N/A', style: 'resultValue' }
                ]
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 15,
            paddingRight: () => 15,
            paddingTop: () => 15,
            paddingBottom: () => 15
          }
        },

        { text: '', margin: [0, 20] }, // Spacer

        // Clinical Notes Section
        {
          text: 'Clinical Notes',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'notesSection',
          table: {
            widths: ['*'],
            body: [[
              {
                text: this.result?.notes || 'No additional clinical notes provided.',
                style: 'notesText',
                margin: [20, 20, 20, 20]
              }
            ]]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0
          }
        },

        { text: '', margin: [0, 30] }, // Spacer

        // Disclaimer
        {
          text: 'This report is generated by an AI-assisted brain tumor detection system and should be reviewed by qualified medical professionals.',
          style: 'disclaimer',
          alignment: 'center'
        },

        { text: '', margin: [0, 15] }, // Spacer

        // Footer
        {
          text: `Generated: ${new Date().toLocaleString()}`,
          style: 'footer',
          alignment: 'center'
        }
      ],

      styles: {
        mainHeader: {
          fontSize: 20,
          bold: true
        },
        sectionTitle: {
          fontSize: 16,
          bold: true,
          color: '#4338ca',
          margin: [0, 10, 0, 0]
        },
        fieldLabel: {
          fontSize: 12,
          bold: true,
          color: '#1f2937',
          margin: [0, 0, 5, 5]
        },
        fieldValue: {
          fontSize: 11,
          color: '#1f2937',
          margin: [0, 0, 0, 5]
        },
        resultLabel: {
          fontSize: 12,
          bold: true,
          color: '#1e40af',
          margin: [0, 0, 5, 8]
        },
        resultValue: {
          fontSize: 12,
          bold: true,
          color: '#1f2937',
          margin: [0, 0, 0, 8]
        },
        notesText: {
          fontSize: 11,
          lineHeight: 1.4,
          color: '#374151'
        },
        disclaimer: {
          fontSize: 10,
          italics: true,
          color: '#6b7280',
          margin: [30, 0, 30, 0]
        },
        footer: {
          fontSize: 9,
          color: '#9ca3af'
        },
        modernSection: {
          fillColor: '#f9fafb',
          margin: [0, 0, 0, 0]
        },
        resultsSection: {
          fillColor: '#eff6ff',
          margin: [0, 0, 0, 0]
        },
        notesSection: {
          fillColor: '#f9fafb',
          margin: [0, 0, 0, 0]
        }
      },

      defaultStyle: {
        // Using PDFMake's default font (Roboto)
      }
    };

    // Generate filename from patient data
    const patientName = this.result?.patient?.name || 'Unknown';
    const patientSurname = this.result?.patient?.surname || 'Patient';
    const fileName = `${patientName}_${patientSurname}_report.pdf`;

    // Generate PDF and display in modal overlay
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    pdfDocGenerator.getBlob((blob: Blob) => {
      // Create blob with filename
      const file = new File([blob], fileName, { type: 'application/pdf' });
      const url = URL.createObjectURL(file);

      // Create modal overlay
      const overlay = document.createElement('div');
      overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

      // Create modal container
      const modal = document.createElement('div');
      modal.style.cssText = `
      width: 90%;
      height: 90%;
      background: white;
      border-radius: 8px;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    `;

      // Create close button
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 50%;
      width: 35px;
      height: 35px;
      font-size: 20px;
      cursor: pointer;
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    `;

      // Create PDF iframe
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 8px;
    `;

      // Close modal function
      const closeModal = () => {
        document.body.removeChild(overlay);
        URL.revokeObjectURL(url);
      };

      // Add event listeners
      closeButton.addEventListener('click', closeModal);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });

      // Escape key to close
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', handleEscape);
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Assemble modal
      modal.appendChild(closeButton);
      modal.appendChild(iframe);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
    });
  }

  downloadPDF(){
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      content: [
        // Header with gradient styling
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 515,
              h: 60,
              linearGradient: ['#2563eb', '#7c3aed'], // Blue to purple gradient
            }
          ]
        },
        {
          text: 'NeuroScan AI - Brain Tumor Detection Report',
          style: 'mainHeader',
          color: 'white',
          alignment: 'center',
          margin: [0, -45, 0, 0] // Adjusted negative margin for smaller height
        },

        { text: '', margin: [0, 25] }, // Spacer

        // Patient Information Section
        {
          text: 'Patient Information',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'modernSection',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                [
                  { text: 'Name:', style: 'fieldLabel' },
                  { text: this.result?.patient?.name || 'N/A', style: 'fieldValue' }
                ],
                [
                  { text: 'Surname:', style: 'fieldLabel' },
                  { text: this.result?.patient?.surname || 'N/A', style: 'fieldValue' }
                ]
              ],
              [
                [
                  { text: 'Patient ID:', style: 'fieldLabel' },
                  { text: this.result?.patient?.id || 'N/A', style: 'fieldValue' }
                ],
                [
                  { text: 'EMBG:', style: 'fieldLabel' },
                  { text: this.result?.patient?.embg || 'N/A', style: 'fieldValue' }
                ]
              ],
              [
                [
                  { text: 'Email:', style: 'fieldLabel' },
                  { text: this.result?.patient?.email || 'N/A', style: 'fieldValue' }
                ],
                [
                  { text: 'Report Date:', style: 'fieldLabel' },
                  { text: this.result?.date ? new Date(this.result.date).toLocaleDateString() : 'N/A', style: 'fieldValue' }
                ]
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 15,
            paddingRight: () => 15,
            paddingTop: () => 10,
            paddingBottom: () => 10
          }
        },

        { text: '', margin: [0, 20] }, // Spacer

        // Medical Professional Section
        {
          text: 'Medical Professional',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'modernSection',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                [
                  { text: 'Doctor:', style: 'fieldLabel' },
                  { text: `Dr. ${this.result?.doctor?.name || 'N/A'} ${this.result?.doctor?.surname || ''}`, style: 'fieldValue' }
                ],
                [
                  { text: 'Doctor ID:', style: 'fieldLabel' },
                  { text: this.result?.doctor?.id || 'N/A', style: 'fieldValue' }
                ]
              ],
              [
                [
                  { text: 'Email:', style: 'fieldLabel' },
                  { text: this.result?.doctor?.email || 'N/A', style: 'fieldValue' }
                ],
                { text: '', style: 'fieldValue' } // Empty cell
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 15,
            paddingRight: () => 15,
            paddingTop: () => 10,
            paddingBottom: () => 10
          }
        },

        { text: '', margin: [0, 20] }, // Spacer

        // Analysis Results Section - Most Important
        {
          text: 'Analysis Results',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'resultsSection',
          table: {
            widths: ['50%', '50%'],
            body: [
              [
                [
                  { text: 'Classification:', style: 'resultLabel' },
                  { text: this.result?.classification == "NONE" ? this.result.classification  : 'N/A', style: 'resultValue' }
                ],
                [
                  { text: 'Confidence Level:', style: 'resultLabel' },
                  { text: this.result?.confidence == 0.0 ? (this.result.confidence * 100).toFixed(2) + '%' : 'N/A', style: 'resultValue' }
                ]
              ],
              [
                [
                  { text: 'Analysis Date:', style: 'resultLabel' },
                  { text: this.result?.date ? new Date(this.result.date).toLocaleDateString() : 'N/A', style: 'resultValue' }
                ],
                [
                  { text: 'Report ID:', style: 'resultLabel' },
                  { text: this.result?.id || 'N/A', style: 'resultValue' }
                ]
              ]
            ]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0,
            paddingLeft: () => 15,
            paddingRight: () => 15,
            paddingTop: () => 15,
            paddingBottom: () => 15
          }
        },

        { text: '', margin: [0, 20] }, // Spacer

        // Clinical Notes Section
        {
          text: 'Clinical Notes',
          style: 'sectionTitle',
          margin: [0, 0, 0, 10]
        },

        {
          style: 'notesSection',
          table: {
            widths: ['*'],
            body: [[
              {
                text: this.result?.notes || 'No additional clinical notes provided.',
                style: 'notesText',
                margin: [20, 20, 20, 20]
              }
            ]]
          },
          layout: {
            hLineWidth: () => 0,
            vLineWidth: () => 0
          }
        },

        { text: '', margin: [0, 30] }, // Spacer

        // Disclaimer
        {
          text: 'This report is generated by an AI-assisted brain tumor detection system and should be reviewed by qualified medical professionals.',
          style: 'disclaimer',
          alignment: 'center'
        },

        { text: '', margin: [0, 15] }, // Spacer

        // Footer
        {
          text: `Generated: ${new Date().toLocaleString()}`,
          style: 'footer',
          alignment: 'center'
        }
      ],

      styles: {
        mainHeader: {
          fontSize: 20,
          bold: true
        },
        sectionTitle: {
          fontSize: 16,
          bold: true,
          color: '#4338ca',
          margin: [0, 10, 0, 0]
        },
        fieldLabel: {
          fontSize: 12,
          bold: true,
          color: '#1f2937',
          margin: [0, 0, 5, 5]
        },
        fieldValue: {
          fontSize: 11,
          color: '#1f2937',
          margin: [0, 0, 0, 5]
        },
        resultLabel: {
          fontSize: 12,
          bold: true,
          color: '#1e40af',
          margin: [0, 0, 5, 8]
        },
        resultValue: {
          fontSize: 12,
          bold: true,
          color: '#1f2937',
          margin: [0, 0, 0, 8]
        },
        notesText: {
          fontSize: 11,
          lineHeight: 1.4,
          color: '#374151'
        },
        disclaimer: {
          fontSize: 10,
          italics: true,
          color: '#6b7280',
          margin: [30, 0, 30, 0]
        },
        footer: {
          fontSize: 9,
          color: '#9ca3af'
        },
        modernSection: {
          fillColor: '#f9fafb',
          margin: [0, 0, 0, 0]
        },
        resultsSection: {
          fillColor: '#eff6ff',
          margin: [0, 0, 0, 0]
        },
        notesSection: {
          fillColor: '#f9fafb',
          margin: [0, 0, 0, 0]
        }
      },

      defaultStyle: {
        // Using PDFMake's default font (Roboto)
      }
    };

    // Generate filename from patient data
    const patientName = this.result?.patient?.name || 'Unknown';
    const patientSurname = this.result?.patient?.surname || 'Patient';
    const fileName = `${patientName}_${patientSurname}_report.pdf`;

    // Download with custom filename
    pdfMake.createPdf(docDefinition).download(fileName);
  }

  protected readonly Download = Download;
  protected readonly Eye = Eye;
}
