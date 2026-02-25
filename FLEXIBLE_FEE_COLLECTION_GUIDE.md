# Flexible Fee Collection System - User Guide

## Overview

The new fee collection system allows you to:
- ✅ **Auto-loads allocated fee structures** when searching by IEMIS ID
- ✅ **Smart category selection** with predefined amounts from allocations
- ✅ **Flexible fee collection** - choose which categories to collect
- ✅ **Custom amounts per category** if needed
- ✅ **Partial payments** with due amount tracking
- ✅ **Live receipt preview** on the right side
- ✅ **Search by IEMIS ID**, name, or roll number
- ✅ **Complete fee breakdown** in receipts

---

## How It Works

### Intelligent Fee Loading

When you search for a student by IEMIS ID:

1. **System checks for allocated fee structures** for that student's class
2. **Auto-populates fee categories** from the allocation
3. **Pre-fills amounts** from the fee structure
4. **Shows allocation status** - which fees are pending, partially paid, or fully paid

### Flexible Collection

You can:
- ✅ **Remove categories** you don't want to collect now
- ✅ **Add extra categories** not in the allocation
- ✅ **Modify amounts** if needed (e.g., for partial payments)
- ✅ **Collect only specific fees** (e.g., just exam fee today)

---

## How to Use

### Step 1: Search for Student

1. Navigate to **Admin Panel** → **Fee Management** → **Collect Fees**
2. Enter:
   - **IEMIS ID** (Recommended - e.g., IEMIS-2024-001), OR
   - **Student Name**, OR
   - **Roll Number**
3. Click **Search**

**What Happens:**
- System finds the student
- Displays student details (IEMIS ID, Name, Class, Roll Number)
- **Automatically fetches allocated fee structures** for that student
- Shows allocation summary (e.g., "NPR 5000 pending")
- **Auto-loads fee categories** from the allocation

### Step 2: Review Auto-Loaded Fees

If the student has an allocated fee structure:
- Fee categories are **automatically populated**
- Amounts are **pre-filled from the allocation**
- Green **"Allocated"** badges show which fees come from the structure
- You'll see a message: "✓ Fee categories auto-loaded from allocated fee structure"

**Example:**
```
✓ 1 fee structure(s) allocated to this student

Fee Categories:
• Admission Fee [Allocated]     NPR 500
• Exam Fee [Allocated]          NPR 350  
• ID Card Fee [Allocated]       NPR 150
Total: NPR 1,000
```

### Step 3: Customize Fee Collection (Optional)

You have full control:

**Option A: Collect All Fees**
- Keep all categories as-is
- Proceed to payment

**Option B: Collect Partial Fees**
- **Remove categories** you don't want to collect now (click trash icon)
- Example: Remove "Admission Fee" if already paid separately
- Remaining total updates automatically

**Option C: Add Extra Fees**
- Click **"Add Category"**
- Select additional fee categories not in the allocation
- Enter custom amounts

**Option D: Modify Amounts**
- Edit the amount field for any category
- Useful for discounts or installments

### Step 4: Add Fee Categories (If No Allocation)

If the student has **no allocated fee structure**:
1. Click **"Add Category"** button
2. For each category:
   - Select the **fee category** (e.g., Tuition, Library, Exam)
   - Enter the **amount** for that category
3. Add multiple categories as needed
4. Click **trash icon** to remove unwanted categories

**The total will be calculated automatically!**

### Step 5: Enter Payment Details

1. **Payment Amount**: Enter the amount being paid
   - Can be **less than total** (partial payment)
   - System will show **Due Amount** automatically
   
2. **Payment Method**: Select from:
   - Cash
   - Bank Transfer
   - Cheque
   - Online Payment
   - Card

3. **Payment Date**: Select the date

4. **(Optional) Bank Details**: If not cash payment
   - Bank Name
   - Account/Cheque Number
   - Reference Number

5. **Remarks**: Optional notes

### Step 4: Review Receipt Preview

**On the right side**, you'll see a live preview showing:
- Student details (IEMIS ID, Name, Class)
- Fee breakdown by category
- Total fee amount
- Amount paid
- **Due amount** (if partial payment)
- Payment method and date

### Step 5: Collect Payment

Click **"Collect Payment"** button

**Receipt will be generated with:**
- Unique receipt number `(e.g., FEE-2026-00001)`
- Complete fee breakdown
- Due amount clearly shown
- Stored in database linked to student's IEMIS ID

---

## Example Scenario

**Student:** Pratik Tamang (IEMIS-2024-006)

**Fee Categories Selected:**
- Admission Fee: NPR 500
- Exam Fee: NPR 350
- ID Card Fee: NPR 150
- **Total: NPR 1,000**

**Payment:**
- Student pays: NPR 600 (partial)
- **Due Amount: NPR 400**

**Receipt Shows:**
```
FEE-2026-00001

Student: Pratik Tamang  
IEMIS: IEMIS-2024-006
Class: 8-C

Fee Details:
- Admission Fee: NPR 500
- Exam Fee: NPR 350
- ID Card Fee: NPR 150
Total: NPR 1,000

Amount Paid: NPR 600
Due Amount: NPR 400  ← Clearly visible!

Payment: CASH
Date: 20/02/2026
```

---

## Key Features

### 1. **Flexible Categories**
- Not bound to predefined fee structures
- Add any combination of categories
- Custom amounts per transaction

### 2. **Partial Payment Support**
- Students can pay in installments
- Due amount tracked automatically
- Clear visibility of pending balance

### 3. **Live Receipt Preview**
- See exactly what will be printed
- Verify details before confirming
- Right-side panel for easy reference

### 4. **IEMIS ID Tracking**
- All payments linked to student's IEMIS ID
- Easy to track payment history per student
- Search by IEMIS ID for quick access

### 5. **Complete Audit Trail**
- Receipt number for every transaction
- Collected by (admin name)
- Payment method and bank details
- Transaction date and time

---

## Database Storage

Each transaction stores:
- Student ID + IEMIS ID
- All fee categories with amounts
- Total amount vs. Paid amount
- Due amount
- Payment details (method, bank info)
- Receipt number
- Collected by (admin)
- Timestamp

**Due amounts are stored in the `remarks` field as JSON** for now. You can query payment history and due amounts per student.

---

## Tips

1. **Always verify IEMIS ID** before collecting payment
2. **Check the live preview** on the right before confirming
3. **Include remarks** for partial payments (e.g., "First installment")
4. **Print receipt** immediately after collection
5. **Keep track of due amounts** for follow-up

---

## Benefits Over Old System

| Old System | New System |
|------------|------------|
| Pre-allocated fee structures required | ✅ Flexible, on-demand category selection |
| Fixed amounts only | ✅ Custom amounts per category |
| Complex allocation process | ✅ Collect directly without allocation |
| No real-time preview | ✅ Live receipt preview |
| Due tracking unclear | ✅ Clear due amount display |

---

## Next Steps

1. **Try a test transaction** with a sample student
2. **Verify receipt preview** matches your needs
3. **Check database** to confirm data is stored correctly
4. **Train staff** on the new workflow

---

## Need Further Customization?

The system can be extended to:
- Create separate table for fee transaction items (better than JSON in remarks)
- Add payment history per student
- Generate due amount reports
- Send SMS/email for pending dues
- Add discount/concession support

Let me know what you need! 🎉
