const PDFKitDoc = require('pdfkit');
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  AlignmentType,
  BorderStyle,
} from 'docx';

export interface DocumentSection {
  title?: string;
  subtitle?: string;
  dateOrLocation?: string;
  content?: string;
  bullets?: string[];
}

export interface DocumentData {
  title: string;
  subtitle?: string;
  summary?: string;
  sections?: DocumentSection[];
  rawText?: string;
}

export class DocumentGeneratorHelper {
  /**
   * Intelligently parses plain text/markdown into structured DocumentData
   */
  public static parseTextToDocumentData(rawText: string, fallbackTitle = 'Document'): DocumentData {
    if (!rawText || !rawText.trim()) {
      return {
        title: fallbackTitle,
        sections: [{ content: 'No content available.' }],
      };
    }

    const lines = rawText.split(/\r?\n/);
    const sections: DocumentSection[] = [];
    let currentSection: DocumentSection | null = null;
    let title = '';
    let subtitle = '';
    let isHeaderParsed = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Extract top header info if first non-empty lines look like name/title/contact
      if (!isHeaderParsed && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
        if (!title) {
          title = line.replace(/^[#\s]+/, '');
          continue;
        } else if (!subtitle && (line.includes('@') || line.includes('|') || line.includes('http') || line.match(/\d{9,}/))) {
          subtitle = line;
          continue;
        } else {
          isHeaderParsed = true;
        }
      } else {
        isHeaderParsed = true;
      }

      // Check for section headings (# Heading, ## Heading, SECTION:, uppercase titles, etc.)
      const headingMatch = line.match(/^#{1,3}\s+(.+)$/) || line.match(/^([A-Z\s]{3,30}):?$/);
      if (headingMatch) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = {
          title: headingMatch[1].trim(),
          bullets: [],
        };
        continue;
      }

      // Check for bullet points (- bullet, * bullet, • bullet, 1. bullet)
      const bulletMatch = line.match(/^[\-\*•\d+\.]\s+(.+)$/);
      if (bulletMatch) {
        if (!currentSection) {
          currentSection = { title: 'Overview', bullets: [] };
        }
        if (!currentSection.bullets) currentSection.bullets = [];
        currentSection.bullets.push(bulletMatch[1].trim());
        continue;
      }

      // Normal paragraph text
      if (!currentSection) {
        currentSection = { title: 'Overview', content: line, bullets: [] };
      } else if (!currentSection.content) {
        currentSection.content = line;
      } else {
        currentSection.content += '\n' + line;
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    }

    return {
      title: title || fallbackTitle,
      subtitle,
      sections: sections.length > 0 ? sections : [{ content: rawText }],
      rawText,
    };
  }

  /**
   * Generates a styled PDF Buffer using PDFKit
   */
  public static async generatePdfBuffer(input: DocumentData | string): Promise<Buffer> {
    const data = typeof input === 'string'
      ? this.parseTextToDocumentData(input)
      : input;

    return new Promise<Buffer>((resolve, reject) => {
      try {
        const PDFDocumentClass = PDFKitDoc.default || PDFKitDoc;
        const doc = new PDFDocumentClass({
          size: 'A4',
          margin: 40,
          bufferPages: true,
        });

        const buffers: Buffer[] = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));

        // Color Palette
        const primaryColor = '#1E3A8A'; // Deep Navy Blue
        const secondaryColor = '#4B5563'; // Slate Gray
        const bodyColor = '#1F2937'; // Dark Charcoal
        const accentLineColor = '#3B82F6'; // Royal Blue

        // 1. Header Section
        doc
          .font('Helvetica-Bold')
          .fontSize(20)
          .fillColor(primaryColor)
          .text(data.title.toUpperCase(), { align: 'left' });

        if (data.subtitle) {
          doc.moveDown(0.2);
          doc
            .font('Helvetica')
            .fontSize(9.5)
            .fillColor(secondaryColor)
            .text(data.subtitle, { align: 'left' });
        }

        doc.moveDown(0.5);
        doc
          .moveTo(40, doc.y)
          .lineTo(555, doc.y)
          .lineWidth(1.5)
          .strokeColor(accentLineColor)
          .stroke();

        doc.moveDown(0.8);

        // Summary / Overview
        if (data.summary) {
          doc
            .font('Helvetica-Oblique')
            .fontSize(10)
            .fillColor(bodyColor)
            .text(data.summary, { align: 'justify', lineGap: 3 });
          doc.moveDown(0.8);
        }

        // 2. Sections Rendering
        if (data.sections && data.sections.length > 0) {
          for (const sec of data.sections) {
            // Check if near bottom of page
            if (doc.y > 750) {
              doc.addPage();
            }

            if (sec.title) {
              doc
                .font('Helvetica-Bold')
                .fontSize(12)
                .fillColor(primaryColor)
                .text(sec.title.toUpperCase(), { align: 'left' });

              doc.moveDown(0.2);
              doc
                .moveTo(40, doc.y)
                .lineTo(555, doc.y)
                .lineWidth(0.75)
                .strokeColor('#E5E7EB')
                .stroke();

              doc.moveDown(0.5);
            }

            if (sec.subtitle || sec.dateOrLocation) {
              doc
                .font('Helvetica-Bold')
                .fontSize(10)
                .fillColor(bodyColor)
                .text(sec.subtitle || '', { continued: !!sec.dateOrLocation });

              if (sec.dateOrLocation) {
                doc
                  .font('Helvetica-Oblique')
                  .fontSize(9)
                  .fillColor(secondaryColor)
                  .text(sec.dateOrLocation, { align: 'right' });
              } else {
                doc.moveDown(0.2);
              }
            }

            if (sec.content) {
              doc
                .font('Helvetica')
                .fontSize(9.5)
                .fillColor(bodyColor)
                .text(sec.content, { align: 'justify', lineGap: 2 });
              doc.moveDown(0.5);
            }

            if (sec.bullets && sec.bullets.length > 0) {
              for (const bullet of sec.bullets) {
                if (doc.y > 760) doc.addPage();
                doc
                  .font('Helvetica')
                  .fontSize(9.5)
                  .fillColor(bodyColor)
                  .text('•  ' + bullet, {
                    indent: 10,
                    align: 'left',
                    lineGap: 2,
                  });
              }
              doc.moveDown(0.5);
            }

            doc.moveDown(0.3);
          }
        } else if (data.rawText) {
          doc
            .font('Helvetica')
            .fontSize(10)
            .fillColor(bodyColor)
            .text(data.rawText, { align: 'justify', lineGap: 3 });
        }

        // 3. Footer / Page Numbers
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          doc
            .moveTo(40, 800)
            .lineTo(555, 800)
            .lineWidth(0.5)
            .strokeColor('#D1D5DB')
            .stroke();

          doc
            .font('Helvetica')
            .fontSize(8)
            .fillColor(secondaryColor)
            .text(
              `AI Resume Analyzer - Page ${i + 1} of ${range.count}`,
              40,
              808,
              { align: 'center', width: 515 }
            );
        }

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Generates a styled DOCX Buffer using docx
   */
  public static async generateDocxBuffer(input: DocumentData | string): Promise<Buffer> {
    const data = typeof input === 'string'
      ? this.parseTextToDocumentData(input)
      : input;

    const docChildren: Paragraph[] = [];

    // Title Paragraph (Heading 1)
    docChildren.push(
      new Paragraph({
        text: data.title,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 },
      })
    );

    // Subtitle / Contact Paragraph
    if (data.subtitle) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.subtitle,
              color: '4B5563',
              size: 20, // 10pt
              italics: true,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Summary Paragraph
    if (data.summary) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: data.summary,
              size: 21,
            }),
          ],
          spacing: { after: 200 },
        })
      );
    }

    // Sections
    if (data.sections && data.sections.length > 0) {
      for (const sec of data.sections) {
        if (sec.title) {
          docChildren.push(
            new Paragraph({
              text: sec.title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 240, after: 120 },
              border: {
                bottom: {
                  color: '3B82F6',
                  space: 4,
                  style: BorderStyle.SINGLE,
                  size: 12,
                },
              },
            })
          );
        }

        if (sec.subtitle || sec.dateOrLocation) {
          docChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: sec.subtitle || '',
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: sec.dateOrLocation ? `   ${sec.dateOrLocation}` : '',
                  italics: true,
                  color: '6B7280',
                  size: 20,
                }),
              ],
              spacing: { after: 100 },
            })
          );
        }

        if (sec.content) {
          const contentLines = sec.content.split('\n');
          for (const line of contentLines) {
            docChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: line,
                    size: 21,
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          }
        }

        if (sec.bullets && sec.bullets.length > 0) {
          for (const bullet of sec.bullets) {
            docChildren.push(
              new Paragraph({
                text: bullet,
                bullet: {
                  level: 0,
                },
                spacing: { after: 60 },
              })
            );
          }
        }
      }
    } else if (data.rawText) {
      const lines = data.rawText.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        docChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.trim(),
                size: 21,
              }),
            ],
            spacing: { after: 100 },
          })
        );
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: docChildren,
        },
      ],
    });

    return await Packer.toBuffer(doc);
  }
}
