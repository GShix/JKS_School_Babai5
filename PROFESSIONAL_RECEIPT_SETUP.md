# Professional Fee Receipt System - Setup Guide

## Overview

A modern, trustworthy fee receipt system with:
- ✅ School logo and official details (PAN, Registration #)
- ✅ Professional layout matching real school receipts
- ✅ Dynamic school profile integration
- ✅ Student details (IEMIS ID, Class, Roll No)
- ✅ Fee breakdown by category
- ✅ Paid amount and balance due tracking
- ✅ Amount in words (e.g., "Three thousand and ninety-five only")
- ✅ Print-ready design
- ✅ Payment method and bank details
- ✅ Signature section

---

## Step 1: Update Database Schema

Run this SQL migration to add receipt fields to school_profile table:

```sql
-- Add additional fields to school_profile table for receipts
ALTER TABLE school_profile
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500) AFTER facebook_url,
ADD COLUMN IF NOT EXISTS pan_number VARCHAR(50) AFTER logo_url,
ADD COLUMN IF NOT EXISTS registration_number VARCHAR(100) AFTER pan_number,
ADD COLUMN IF NOT EXISTS affiliation VARCHAR(255) AFTER registration_number,
ADD COLUMN IF NOT EXISTS fax VARCHAR(20) AFTER phone,
ADD COLUMN IF NOT EXISTS tax_percentage DECIMAL(5,2) DEFAULT 0.00 AFTER affiliation;

-- Update default school profile with sample data
UPDATE school_profile 
SET 
  pan_number = '301480818',
  registration_number = '345/65',
  affiliation = 'Ministry of Education, Government of Nepal',
  fax = '057-527263'
WHERE id = 1;
```

**How to run:**
1. Open phpMyAdmin or MySQL command line
2. Select your school database
3. Copy and paste the SQL above
4. Click "Execute" or press Enter

---

## Step 2: Upload School Logo

1. Navigate to **Admin Panel** → **School Management** → **School Profile**
2. Upload your school logo (PNG/JPG, max 500KB recommended)
3. The system will save the logo URL to the database
4. Logo will automatically appear on receipts

**Logo Requirements:**
- Format: PNG or JPG
- Recommended size: 200x200 pixels
- Background: Transparent (for PNG) or white
- File size: Under 500KB

---

## Step 3: Update School Profile Details

Make sure these fields are filled in the School Profile:

**Required for Receipts:**
- School Name (English & Nepali)
- Address (complete with ward, municipality, district)
- Phone / Fax
- Email
- PAN Number
- Registration Number
- Logo URL

**Optional:**
- Affiliation
- Website
- Tax Percentage

---

## Step 4: Test the Receipt System

### Collect a Fee Payment:

1. Go to **Admin Panel** → **Fee Management** → **Collect Fees**
2. Search for a student by IEMIS ID
3. Add fee categories (e.g., Admission, Exam, ID Card)
4. Enter payment amount (can be partial)
5. Click **"Collect Payment"**

### Receipt Modal Will Appear:

The receipt will show:
- **School header** with logo and contact details
- **PAN and Registration number** (top right)
- **Receipt number** and date
- **Student details** (Name, Class, Roll No, IEMIS ID)
- **Fee breakdown** table with all categories
- **Total, Paid, and Balance Due**
- **Amount in words** (e.g., "Three thousand only")
- **Payment method** and bank details
- **Signature section** for receiver

### Print the Receipt:

Click the **"Print Receipt"** button in the modal. The browser print dialog will open with a clean, professional layout.

---

## Features Breakdown

### 1. **School Header**
```
┌─────────────────────────────────────────────────────┐
│  [Logo]     SCHOOL NAME (ENGLISH)                   │
│             स्कूल नाम (नेपाली)                       │
│             Address - Ward, Municipality, District  │
│             Tel/Fax: XXX-XXXXXX                     │
│             Email: school@email.com                 │
└─────────────────────────────────────────────────────┘
```

### 2. **Receipt Details**
- Unique receipt number (e.g., FEE-2026-00001)
- Date of payment
- Student full details

### 3. **Fee Breakdown Table**
```
SN | Fee Descriptions      | Amount Rs
---|------------------------|----------
1  | Admission Fee          | 500.00
2  | Exam Fee               | 350.00
3  | ID Card Fee            | 150.00
   |                        |
   |                        |
---|------------------------|----------
   | Total Bill: 1000.00    | Total    | 1000.00
```

### 4. **Payment Summary**
```
Scholar | Penal | Tax   | Paid    | Bal Due
0.00    | 0.00  | 20.00 | 600.00  | 400.00
```

### 5. **Amount in Words**
Automatically converts amount to words:
- 3095.00 → "Three thousand and ninety-five only"
- Handles lakhs, thousands, hundreds
- Includes paisa for decimal values

### 6. **Footer**
- "E & O E" (Errors and Omissions Excepted)
- Collected by (admin name)
- Thank you message
- Signature section

---

## Customization Options

### A. Add More Fields to Receipt

Edit [`FeeReceipt.tsx`](frontend/src/components/admin/FeeReceipt.tsx):

```typescript
// Add new fields to ReceiptData interface
interface ReceiptData {
  // ... existing fields
  academicYear?: string;  // Add academic year
  month?: string;         // Add fee month
}
```

### B. Change Receipt Layout

Modify the component's JSX structure in FeeReceipt.tsx.

### C. Adjust Print Styles

Update the `<style>` block at the bottom of FeeReceipt.tsx:

```css
@media print {
  .receipt-container {
    width: 100%;
    max-width: 800px;
  }
  
  @page {
    margin: 0.5cm;  /* Adjust margins */
    size: A4;        /* Or letter, A5, etc. */
  }
}
```

### D. Multi-language Support

Add Nepali translations:
1. Create duplicate fields with `_nepali` suffix
2. Use conditional rendering to show Nepali text
3. Example: `schoolNameNepali`, `addressNepali`

---

## From Database to Receipt: Data Flow

```
1. Admin collects payment
   └─> FeeCollectionNew.tsx

2. Payment data sent to backend
   └─> POST /api/fee-management/transactions/collect-flexible
   
3. Transaction saved to database
   └─> feeTransactions table
   
4. Receipt data prepared
   └─> Student + Fees + Payment details
   
5. School profile fetched
   └─> GET /api/school-profile
   
6. Receipt rendered
   └─> FeeReceipt.tsx component
   
7. User clicks "Print"
   └─> Browser print dialog
   
8. Professional receipt printed! 🎉
```

---

## Troubleshooting

### Issue: Logo not showing on receipt
**Solution:** 
- Check if `logo_url` field exists in school_profile table
- Verify the logo URL is valid and accessible
- Upload logo through School Profile page

### Issue: PAN/Registration number missing
**Solution:**
- Run the SQL migration (Step 1)
- Update school profile with PAN and registration numbers

### Issue: Receipt looks broken when printing
**Solution:**
- Use Chrome/Edge for best print results
- Check print preview before printing
- Ensure no browser extensions block print styles

### Issue: Amount in words incorrect
**Solution:**
- The function handles numbers up to lakhs
- For crores, update `numberToWords()` function in FeeReceipt.tsx

### Issue: Receipt modal not appearing
**Solution:**
- Check browser console for errors
- Verify school profile is loaded (`schoolProfile` state)
- Ensure receipt data is populated after payment

---

## Backend Updates Needed

Update the backend controller to include `collectedByName`:

```javascript
// In feeTransactionController.js - collectFlexibleFeePayment

const collectedBy = req.admin.id;
const collectedByName = req.admin.fullName || req.admin.email;

// Return in response
res.status(201).json({
  status: 'success',
  data: {
    receiptNumber: transaction.receiptNumber,
    collectedByName: collectedByName,  // ✅ Add this
    // ... other data
  }
});
```

---

## Next Steps

### 1. Email/SMS Receipts (Future Enhancement)
- Add email sending after payment
- Attach PDF version of receipt
- Send SMS notification with receipt number

### 2. Receipt History
- Create "Receipt History" page
- Allow reprinting old receipts
- Filter by date, student, or receipt number

### 3. Bulk Printing
- Print multiple receipts at once
- Export receipts to PDF
- Generate monthly collection reports

### 4. Customizable Templates
- Admin can choose receipt templates
- Multiple designs (modern, classic, minimal)
- School-specific branding

---

## Example Receipt Output

Based on the reference image, the system generates receipts that look like:

```
┌──────────────────────────────────────────────────────┐
│ [LOGO]  JKSS SCHOOL                     PAN: 301... │
│         School Address                  Regd: 345/65 │
│         Tel/Fax: 057-527263                          │
│         Email: school@email.com                      │
├──────────────────────────────────────────────────────┤
│ Receipt                        Bill No: FEE-2026-001 │
│                                Date: 20/02/2026      │
├──────────────────────────────────────────────────────┤
│ Name: SHYAM KUMAR LAMA        Class: ONE             │
│ Roll No: 45    Sec: A         IEMIS: XXXX            │
├──────────────────────────────────────────────────────┤
│ SN | Fee Descriptions          | Amount Rs           │
├────┼──────────────────────────┼────────────────────┤
│ 1  | Monthly Fee               | 2000.00            │
│ 2  | Transportation Fee        | 400.00             │
│ 3  | Exam Fee                  | 300.00             │
│ 4  | Computer Fee              | 300.00             │
│ 5  | Tie/Belt                  | 75.00              │
├────┼──────────────────────────┼────────────────────┤
│ Total Bill: 3075.00            Total    | 3075.00   │
├────┬─────┬─────┬────────┬──────────────────────────┤
│Scholar|Penal|Tax  |Paid    |Bal Due                │
│ 0.00  |0.00 |20.00|3095.00 |0.00                   │
├──────────────────────────────────────────────────────┤
│ Three thousand and ninety five only.                 │
├──────────────────────────────────────────────────────┤
│ E & O E     Thanks for your cooperation  Received by│
│                                          Signature   │
└──────────────────────────────────────────────────────┘
```

---

## Files Created/Modified

### New Files:
- `backend/src/database/migrations/add_school_profile_receipt_fields.sql`
- `frontend/src/components/admin/FeeReceipt.tsx`

### Modified Files:
- `frontend/src/api/types.ts` (added receipt fields to SchoolProfile)
- `frontend/src/pages/admin/FeeCollectionNew.tsx` (integrated receipt modal)

---

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify database schema has new fields
3. Ensure school profile is complete
4. Test with a simple payment first

Happy fee collecting! 🎉
