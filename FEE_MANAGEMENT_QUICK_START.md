# Fee Management System - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you quickly set up and start using the new transaction-based fee management system.

---

## Step 1: Start the Backend Server

```bash
cd backend
npm run dev
```

The server will automatically create the new fee management tables:
- ✅ `fee_categories`
- ✅ `fee_structures`
- ✅ `fee_structure_items`
- ✅ `fee_allocations`
- ✅ `fee_transactions`

**Look for this message in console:**
```
✅ Database & tables synced (development mode with ALTER)
⚠️  New fee management tables created
```

---

## Step 2: Create Initial Fee Categories

Run the setup script to create common fee categories:

```bash
cd backend
node scripts/setupFeeManagement.js
```

**This creates 12 fee categories:**
1. Tuition Fee
2. Admission Fee
3. Library Fee
4. Lab Fee
5. Sports Fee
6. Exam Fee
7. Transport Fee
8. Uniform Fee
9. Computer Fee
10. ID Card Fee
11. Stationery Fee
12. Activity Fee

---

## Step 3: Access the Admin Panel

1. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

2. Login as admin

3. Navigate to **Fee Setup** (add this to your sidebar navigation)

---

## Step 4: Create a Fee Structure

1. In **Fee Setup** page, go to **Fee Structures** tab
2. Click **Add Structure**
3. Fill in:
   - **Name:** Class 8 - Academic Year 2081-2082
   - **Academic Year:** 2081-2082
   - **Class:** 8
   - **Section:** (leave blank for all sections)
   - **Due Date:** 2024-12-31

4. Click **Add Item** to add fee components:

   | Category      | Amount (NPR) |
   |---------------|--------------|
   | Tuition Fee   | 15,000       |
   | Library Fee   | 2,000        |
   | Lab Fee       | 3,000        |
   | Sports Fee    | 1,000        |
   
   **Total:** NPR 21,000

5. Click **Save Structure**

---

## Step 5: Allocate Fees to Students

### Option A: Via API (Quick way to allocate to entire class)

```bash
curl -X POST http://localhost:4000/api/fee-management/allocations/class \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "class": "8",
    "feeStructureId": 1
  }'
```

### Option B: Via Frontend (Coming Soon)
A "Fee Allocation" page will be added to the admin panel for easier allocation management.

---

## Step 6: Collect Your First Payment

1. Navigate to **Fee Collection** page
2. Search for a student:
   - Type student name or roll number
   - Click **Search**
   - Select student from results

3. View pending fees:
   - System shows all pending fee allocations
   - Click on the allocation you want to collect

4. Enter payment details:
   - **Amount:** 5000 (or any amount up to the balance)
   - **Payment Method:** Cash
   - **Payment Date:** Today's date
   - **Remarks:** (optional) "First installment"

5. Click **Collect Payment**

6. **Receipt Generated!** 
   - Receipt Number: `FEE-2024-00001`
   - Payment recorded
   - Balance updated automatically

---

## Step 7: View Transactions

1. Navigate to **Fee Transactions** page
2. You'll see:
   - Summary cards (total transactions, total amount)
   - All transactions in a table
   - Filter options (date range, payment method, status)

3. Click **Download** on any transaction to get receipt

---

## 🎯 Common Use Cases

### Scenario 1: Partial Payment

**Student has NPR 21,000 balance, pays NPR 5,000:**

1. Collect NPR 5,000 payment
2. System updates:
   - Paid Amount: NPR 5,000
   - Balance: NPR 16,000
   - Status: `partial` ✨

**Student pays another NPR 10,000:**

1. Collect NPR 10,000 payment
2. System updates:
   - Paid Amount: NPR 15,000
   - Balance: NPR 6,000
   - Status: Still `partial` ✨

**Student pays final NPR 6,000:**

1. Collect NPR 6,000 payment
2. System updates:
   - Paid Amount: NPR 21,000
   - Balance: NPR 0
   - Status: `paid` ✅

### Scenario 2: Discount for Sibling

**Allocate fee with discount:**

```json
POST /api/fee-management/allocations/student
{
  "studentId": 5,
  "feeStructureId": 1,
  "discount": 2000,
  "discountReason": "Sibling discount - 2nd child"
}
```

**Result:**
- Total Amount: NPR 21,000
- Discount: NPR 2,000
- Balance: NPR 19,000 ✨

### Scenario 3: View Student's Fee History

```bash
GET /api/fee-management/allocations/student/5
```

**Returns:**
- All fee allocations
- Total allocated, paid, balance
- Status breakdown
- All transactions

---

## 📊 Navigation Updates

Add these pages to your admin sidebar:

```tsx
// In your admin layout sidebar

// Fee Management Section
{
  title: 'Fee Management',
  icon: <DollarSign />,
  children: [
    {
      title: 'Fee Collection',
      path: '/admin/fee-collection',
      icon: <CreditCard />
    },
    {
      title: 'Fee Setup',
      path: '/admin/fee-setup',
      icon: <Settings />
    },
    {
      title: 'Transactions',
      path: '/admin/fee-transactions',
      icon: <Receipt />
    }
  ]
}
```

**Route Configuration:**

```tsx
// In your router
import { FeeCollection, FeeSetup, FeeTransactions } from './pages/admin';

// Add routes
<Route path="/admin/fee-collection" element={<FeeCollection />} />
<Route path="/admin/fee-setup" element={<FeeSetup />} />
<Route path="/admin/fee-transactions" element={<FeeTransactions />} />
```

---

## 🔧 Troubleshooting

### Tables not created?

**Check:**
1. Backend console shows "Database & tables synced"
2. `alter: true` is set in `connection.js` for development
3. Database connection is working

**Fix:**
```javascript
// In backend/src/database/connection.js
if (process.env.NODE_ENV === 'development') {
  sequelize.sync({ alter: true })  // Make sure this is true
}
```

### Can't see fee categories?

**Run the setup script:**
```bash
cd backend
node scripts/setupFeeManagement.js
```

### Authorization error?

**Make sure:**
1. You're logged in as admin
2. Token is being sent in Authorization header
3. Admin middleware is working

---

## 📈 Daily Workflow

### Morning:
1. Open **Fee Collection** page
2. Ready to collect payments

### During the Day:
1. Student comes to pay fee
2. Search student
3. Select fee allocation
4. Enter payment amount
5. Collect payment → Receipt generated
6. Give receipt to student

### End of Day:
1. Go to **Fee Transactions**
2. Filter by today's date
3. View daily collection report
4. Total collected: NPR X,XXX
5. Breakdown by payment method

---

## 🎨 Status Colors

- 🟡 **Pending** - Yellow/Orange (no payment yet)
- 🔵 **Partial** - Blue (some payment made)
- 🟢 **Paid** - Green (fully paid)
- 🔴 **Overdue** - Red (past due date)
- ⚪ **Cancelled** - Gray (transaction cancelled)

---

## 💡 Pro Tips

1. **Bulk Allocation:** Use the class allocation API to quickly allocate fees to all students in a class

2. **Discounts:** Always provide a `discountReason` when applying discounts for audit purposes

3. **Partial Payments:** Accept partial payments freely - the system tracks everything

4. **Daily Reports:** Check daily collection reports at end of day for accountability

5. **Search:** Use roll number for faster student search in fee collection

---

## 📞 Need Help?

**Detailed Guides:**
- `FEE_MANAGEMENT_SYSTEM_GUIDE.md` - Complete implementation guide
- `FEE_MANAGEMENT_API_REFERENCE.md` - API documentation

**Quick Commands:**
```bash
# Setup fee categories
node backend/scripts/setupFeeManagement.js

# View backend logs
cd backend && npm run dev

# View frontend
cd frontend && npm run dev
```

---

## ✅ Checklist

- [ ] Backend server running
- [ ] Tables created successfully
- [ ] Fee categories created (via script)
- [ ] First fee structure created
- [ ] Fees allocated to students
- [ ] First payment collected
- [ ] Receipt generated successfully
- [ ] Transactions visible in dashboard

**Once all checked:** You're ready to go! 🎉

---

**Next Steps:**
- Create fee structures for all classes
- Allocate fees to all students
- Train staff on fee collection process
- Setup daily reporting routine

---

**Happy Fee Collecting! 💰**
