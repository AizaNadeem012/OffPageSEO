import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'

export async function GET() {
  try {
    const sampleData = [
      {
        'Website URL': 'https://fashionpress-network.com',
        'Website Name': 'FashionPress Media Network',
        'Login URL': 'https://fashionpress-network.com/wp-login.php',
        'Submission URL': 'https://fashionpress-network.com/wp-admin/post-new.php',
        'Username': 'raza_author',
        'Password': 'Fashion2026!*',
        'Category': 'Fashion & Lifestyle Guest Blogs',
        'Target Landing Page': 'https://www.afimahclothingstore.com',
        'Preferred Anchor': 'sustainable luxury apparel',
        'Priority': 'high',
        'Notes': 'High authority guest posting portal with direct WordPress CMS login',
      },
      {
        'Website URL': 'https://apparelresources.com',
        'Website Name': 'Apparel Resources International',
        'Login URL': 'https://apparelresources.com/login',
        'Submission URL': 'https://apparelresources.com/submit',
        'Username': 'raza_author',
        'Password': 'Fashion2026!*',
        'Category': 'Fashion & Apparel',
        'Target Landing Page': 'https://www.afimahclothingstore.com',
        'Preferred Anchor': 'sustainable luxury apparel',
        'Priority': 'high',
        'Notes': 'High authority apparel news portal, accepts industry insights & thought leadership',
      },
      {
        'Website URL': 'https://fashionunited.com',
        'Website Name': 'FashionUnited Global Network',
        'Login URL': 'https://fashionunited.com/login',
        'Submission URL': 'https://fashionunited.com/contribute',
        'Username': 'raza_contributor',
        'Password': 'FashionPass2026!',
        'Category': 'Fashion Business & News',
        'Target Landing Page': 'https://www.afimahclothingstore.com',
        'Preferred Anchor': 'bespoke streetwear',
        'Priority': 'high',
        'Notes': 'International fashion industry network, excellent guest feature opportunities',
      },
      {
        'Website URL': 'https://theformalclub.in',
        'Website Name': 'The Formal Club Editorial',
        'Login URL': 'https://theformalclub.in/wp-login.php',
        'Submission URL': 'https://theformalclub.in/wp-admin/post-new.php',
        'Username': 'raza_editor',
        'Password': 'ClubPassword2026!',
        'Category': 'Apparel & Menswear',
        'Target Landing Page': 'https://www.afimahclothingstore.com',
        'Preferred Anchor': 'luxury menswear tailoring',
        'Priority': 'medium',
        'Notes': 'Editorial blog focused on formal menswear and bespoke styling',
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(sampleData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Target Websites')

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' })

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="rankwave_target_websites_template.xlsx"',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
