# Quick Setup Guide - Fix Database Migration Error

## The Problem
You're seeing: `❌ Database sync error: column "purpose" does not exist`

This happens because the new fields haven't been added to your database yet.

---

## Solution: Choose ONE of these methods

### ✅ Method 1: Run SQL Directly (RECOMMENDED - Fastest)

**Step 1:** Open your database tool (pgAdmin, Supabase SQL Editor, DBeaver, etc.)

**Step 2:** Copy and run this SQL file:
```
backend/scripts/fee_structure_migration.sql
```

**Step 3:** Restart your backend server

That's it! ✅

---

### ✅ Method 2: Configure .env and Run Migration Script

**Step 1:** Create `.env` file in `backend/` folder

Copy from `backend/.env.example` and fill in your database connection:

```env
# Database Configuration
db_string=postgresql://username:password@host:port/database

# Example Supabase format:
# db_string=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**Step 2:** Run the migration script
```bash
cd backend
node scripts/addFeeStructureEnhancements.js
```

**Step 3:** Restart your backend server

---

## How to Get Your Database Connection String

### If using Supabase:
1. Go to your Supabase project
2. Click **Settings** → **Database**
3. Scroll to **Connection String**
4. Copy the **Connection Pooling** string (Transaction mode or Session mode)
5. Replace `[YOUR-PASSWORD]` with your actual database password

### If using local PostgreSQL:
```
postgresql://postgres:yourpassword@localhost:5432/your_database_name
```

---

## Verify Migration Was Successful

Run this SQL to check:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'fee_structures' 
AND column_name IN ('purpose', 'isTemplate', 'clonedFrom');
```

You should see all three columns listed.

---

## Still Having Issues?

1. **Check your database is running**
   ```bash
   # Test connection
   psql "your_connection_string_here"
   ```

2. **Check backend logs** for detailed error messages

3. **Verify table exists**
   ```sql
   SELECT * FROM fee_structures LIMIT 1;
   ```

4. **Reset and try again**
   - Stop backend server
   - Run migration SQL manually
   - Start backend server

---

## Next Steps After Migration

Once migration is successful:

1. ✅ New fee structure fields are available
2. ✅ Navigate to `/admin/fee-structures` 
3. ✅ Create your first enhanced fee structure
4. ✅ Use Smart Allocation to assign to students

---

**Need Help?** Check the full guide: `ENHANCED_FEE_SYSTEM_GUIDE.md`
