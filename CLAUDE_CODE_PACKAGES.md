# Claude Code Development Packages
**For Brandon Bot (Boss) to hand off to Claude Code**
**Last Updated:** 2026-02-01 15:45 EST

---

## Package 1: PoolApp Supabase Integration

### Context
PoolApp needs a production database backend. Currently using mock/demo data. Need to wire up Supabase for real data persistence.

### Files to Work With
- **Project location:** `/Users/brandonbot/projects/workbench/poolapp/`
- **Database schema:** Look for `001_initial_schema.sql` or similar in root
- **Environment variables:** `.env.local` file (create if doesn't exist)

### Step-by-Step Instructions

#### 1. Create Supabase Production Project
```bash
cd /Users/brandonbot/projects/workbench/poolapp
supabase projects create --name poolapp-prod --org-id [your-org-id]
```
*Note: This will return project URL and anon key. Save these for .env.local.*

#### 2. Deploy Database Schema
```bash
# First, check if schema file exists
ls -la *.sql

# If you find the schema file, run:
supabase db push --project-id [project-id] --schema [schema-file.sql]
```

#### 3. Set Up Environment Variables
Create or edit `.env.local` in poolapp root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key-from-step-1]
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

#### 4. Wire Up Environment in Codebase
Check environment variable usage in code:
```bash
# Find files using supabase
grep -r "NEXT_PUBLIC_SUPABASE" . --include="*.tsx" --include="*.ts"
```

Ensure all files reference `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

#### 5. Test Database Connection
Create a simple test to verify connection:
```bash
npm run dev
```
Visit `http://localhost:3000/api/test-db` (or similar test endpoint) to verify database is accessible.

#### 6. Test Full User Flow
1. Navigate to PoolApp in browser
2. Create a test customer
3. Schedule a test job
4. Verify data appears in Supabase dashboard

### Validation Criteria
- ✅ Supabase project created and running
- ✅ Database tables deployed successfully
- ✅ Environment variables configured
- ✅ PoolApp connects to database without errors
- ✅ Test data persists in database
- ✅ No console errors related to database connection

---

## Package 2: PoolApp "Add Job" Modal Implementation

### Context
Currently, "Add Job" button on dashboard only links to /schedule page. Needs true modal with form for creating jobs directly.

### Files to Work With
- **Dashboard page:** `app/(dashboard)/dashboard/page.tsx`
- **Schedule page:** `app/(dashboard)/schedule/page.tsx`

### Step-by-Step Instructions

#### 1. Create Modal Component
Create `app/components/add-job-modal.tsx`:
```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function AddJobModal() {
  const [formData, setFormData] = useState({
    customerId: '',
    technicianId: '',
    date: '',
    time: '',
    serviceType: 'regular', // regular, chemical, opening, closing
    priority: 'medium', // low, medium, high
    notes: ''
  })
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Add Supabase insertion logic here
    console.log('Creating job:', formData)
    setIsOpen(false)
    setFormData({
      customerId: '',
      technicianId: '',
      date: '',
      time: '',
      serviceType: 'regular',
      priority: 'medium',
      notes: ''
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Job</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Job</DialogTitle>
          <DialogDescription>
            Add a new service job to the schedule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="customerId">Customer</label>
              <select
                id="customerId"
                value={formData.customerId}
                onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select customer...</option>
                {/* TODO: Fetch customers from database */}
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="technicianId">Technician</label>
              <select
                id="technicianId"
                value={formData.technicianId}
                onChange={(e) => setFormData({...formData, technicianId: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select technician...</option>
                {/* TODO: Fetch technicians from database */}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="time">Time</label>
                <input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <label htmlFor="serviceType">Service Type</label>
              <select
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="regular">Regular Service</option>
                <option value="chemical">Chemical Treatment</option>
                <option value="opening">Pool Opening</option>
                <option value="closing">Pool Closing</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit">Create Job</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

#### 2. Update Dashboard to Use Modal
Edit `app/(dashboard)/dashboard/page.tsx`:
- Replace the "Add Job" link with the new `AddJobModal` component
- Import the modal: `import { AddJobModal } from '@/components/add-job-modal'`
- Replace: `<Link href="/schedule">Add Job</Link>` with `<AddJobModal />`

#### 3. Connect Modal to Database
In the modal's `handleSubmit` function, add Supabase insertion:

```tsx
import { supabase } from '@/lib/supabase/client'

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  const { data, error } = await supabase
    .from('jobs')
    .insert([
      {
        customer_id: formData.customerId,
        technician_id: formData.technicianId,
        date: formData.date,
        time: formData.time,
        service_type: formData.serviceType,
        priority: formData.priority,
        notes: formData.notes,
        created_at: new Date().toISOString()
      }
    ])

  if (error) {
    console.error('Error creating job:', error)
    // TODO: Show error message to user
    return
  }

  console.log('Job created successfully:', data)
  setIsOpen(false)
  // Reset form
}
```

#### 4. Create Supabase Client (if not exists)
Create `lib/supabase/client.ts`:
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 5. Create Database Table for Jobs
In Supabase dashboard, create a `jobs` table with columns:
- `id` (primary key, uuid)
- `customer_id` (text, references customers table)
- `technician_id` (text, references technicians table)
- `date` (date)
- `time` (time without time zone)
- `service_type` (text)
- `priority` (text)
- `notes` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### 6. Test Modal Functionality
1. Navigate to dashboard
2. Click "Add Job"
3. Fill in form fields
4. Click "Create Job"
5. Verify job appears in Supabase database
6. Verify job appears on schedule page

### Validation Criteria
- ✅ Modal opens when "Add Job" button clicked
- ✅ Form fields are populated (customer, technician, date, time, service type, priority, notes)
- ✅ Form validation works (required fields show errors if empty)
- ✅ Job is inserted into Supabase `jobs` table
- ✅ Modal closes after successful submission
- ✅ Job appears on schedule page
- ✅ No console errors

---

## Package 3: PoolApp Real-Time Features

### Context
Add live technician tracking and job completion workflows with real-time updates.

### Files to Work With
- **Technicians page:** `app/(dashboard)/technicians/page.tsx`
- **Routes page:** `app/(dashboard)/routes/page.tsx`

### Step-by-Step Instructions

#### 1. Implement Technician Location Tracking
Create `app/lib/realtime/technician-locations.ts`:
```ts
import { supabase } from '@/lib/supabase/client'

export async function getTechnicianLocations() {
  const { data, error } = await supabase
    .from('technician_locations')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching technician locations:', error)
    return []
  }

  return data || []
}

export async function updateTechnicianLocation(technicianId: string, location: { lat: number, lng: number, lastSeen: string }) {
  const { error } = await supabase
    .from('technician_locations')
    .upsert({
      technician_id: technicianId,
      ...location,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error updating technician location:', error)
  }
}
```

#### 2. Create Real-Time Subscription for Job Updates
In the Routes page, add real-time listener:
```tsx
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

// Real-time job updates
useEffect(() => {
  const subscription = supabase
    .channel('jobs-updates')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs' })
    .subscribe((payload) => {
      console.log('Job update received:', payload)
      // Trigger re-fetch of routes/jobs
      fetchRoutes()
    })

  return () => {
    subscription.unsubscribe()
  }
}, [])
```

#### 3. Add Job Completion Workflow
Create `app/lib/workflows/job-completion.ts`:
```ts
import { supabase } from '@/lib/supabase/client'

export async function markJobComplete(jobId: string, technicianId: string, photos: string[]) {
  // Update job status
  const { error: statusError } = await supabase
    .from('jobs')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', jobId)
    .single()

  if (statusError) {
    console.error('Error marking job complete:', statusError)
    return { success: false }
  }

  // TODO: Send notification to customer via email/SMS
  // TODO: Update technician performance metrics

  // Record completion photo evidence
  const { error: photoError } = await supabase
    .from('job_photos')
    .insert([
      {
        job_id: jobId,
        technician_id: technicianId,
        photos,
        uploaded_at: new Date().toISOString()
      }
    ])

  if (photoError) {
    console.error('Error storing job photos:', photoError)
  }

  return { success: true }
}

export async function scheduleNextJob(technicianId: string) {
  // Find next pending job for technician
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('technician_id', technicianId)
    .eq('status', 'pending')
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching next job:', error)
    return null
  }

  return data
}
```

#### 4. Create Database Tables for Real-Time Features
In Supabase dashboard, create:
- `technician_locations` table
- `job_photos` table
- `job_completion_logs` table

#### 5. Test Real-Time Functionality
1. Update technician location
2. Verify location appears on Routes page
3. Mark a job as complete
4. Verify job status updates across all views
5. Check console for real-time subscription events

### Validation Criteria
- ✅ Technician location tracking works
- ✅ Real-time job updates trigger across all views
- ✅ Job completion workflow functions
- ✅ Notifications trigger for completed jobs
- ✅ No console errors related to real-time features

---

## Package 4: API Integrations

### Context
PoolApp needs to connect to external APIs: pool chemistry (for alerts), weather (for route adjustments), and potentially other systems.

### Files to Work With
- **Project root:** `/Users/brandonbot/projects/workbench/poolapp/`
- **Environment:** `.env.local` file

### Step-by-Step Instructions

#### 1. Pool Chemistry API Integration
Create `app/lib/api/pool-chemistry.ts`:
```ts
export interface ChemistryData {
  poolId: string
  ph: number
  chlorine: number
  alkalinity: number
  cyanuricAcid: number
  temperature: number
  lastTested: string
}

export async function getPoolChemistry(poolId: string): Promise<ChemistryData | null> {
  try {
    // TODO: Replace with actual API call to pool chemistry service
    // For now, return mock data
    return {
      poolId,
      ph: 7.8,
      chlorine: 1.2,
      alkalinity: 120,
      cyanuricAcid: 50,
      temperature: 78,
      lastTested: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching pool chemistry:', error)
    return null
  }
}

export function checkChemistryThresholds(data: ChemistryData): { isHigh: boolean, isLow: boolean, issues: string[] } {
  const issues: string[] = []

  if (data.ph > 7.8) {
    issues.push('pH too high')
  }
  if (data.ph < 7.2) {
    issues.push('pH too low')
  }
  if (data.chlorine < 1.0) {
    issues.push('Chlorine too low')
  }
  if (data.alkalinity < 80) {
    issues.push('Alkalinity too low')
  }
  if (data.cyanuricAcid > 50) {
    issues.push('Cyanuric acid too high')
  }

  return {
    isHigh: data.ph > 7.8 || data.chlorine < 1.0,
    isLow: data.ph < 7.2,
    issues
  }
}
```

#### 2. Weather API Integration for Routing
Create `app/lib/api/weather.ts`:
```ts
export interface WeatherData {
  temperature: number
  precipitation: number
  windSpeed: number
  visibility: number
  conditions: string
}

export async function getWeatherForRoute(zipCode: string): Promise<WeatherData | null> {
  try {
    // TODO: Replace with actual weather API call
    // For now, return mock data
    return {
      temperature: 75,
      precipitation: 0,
      windSpeed: 5,
      visibility: 10,
      conditions: 'sunny'
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    return null
  }
}

export function shouldAdjustRoute(weather: WeatherData): boolean {
  // Adjust route if severe weather conditions
  return weather.precipitation > 0.5 || weather.windSpeed > 20 || weather.visibility < 2
}
```

#### 3. Integrate Chemistry Alerts into Customers Page
Update `app/(dashboard)/customers/page.tsx`:
- Add `getPoolChemistry()` call
- Add `checkChemistryThresholds()` check
- Display alerts when thresholds are exceeded

#### 4. Add Environment Variables for API Keys
Update `.env.local`:
```env
# Pool Chemistry API
POOL_CHEMISTRY_API_KEY=your-api-key-here
POOL_CHEMISTRY_API_URL=https://api.pool-chemistry.com

# Weather API
WEATHER_API_KEY=your-weather-api-key-here
```

#### 5. Test API Integrations
1. Test pool chemistry retrieval
2. Test weather data retrieval
3. Verify chemistry alerts trigger on customer page
4. Verify route adjustment logic

### Validation Criteria
- ✅ Pool chemistry data can be retrieved
- ✅ Weather data can be retrieved
- ✅ Chemistry alerts trigger correctly
- ✅ Route adjustment logic works
- ✅ API errors are handled gracefully

---

## Testing Checklist (Run After All Packages)

### Package 1: Supabase Integration
- [ ] Supabase project created and accessible
- [ ] Database tables deployed (customers, technicians, jobs, schedules, invoices)
- [ ] Environment variables set correctly
- [ ] PoolApp connects to database without errors
- [ ] Test customer creates and persists
- [ ] Test job creates and persists
- [ ] Test technician creates and persists
- [ ] Test invoice creates and persists

### Package 2: Add Job Modal
- [ ] Modal component created and exported
- [ ] Modal opens and closes correctly
- [ ] Form validation works
- [ ] Job is inserted into database
- [ ] Job appears on schedule page after creation
- [ ] Error handling works for failed submissions

### Package 3: Real-Time Features
- [ ] Technician location tracking works
- [ ] Real-time job updates trigger across views
- [ ] Job completion workflow functions
- [ ] Technician can mark jobs as complete
- [ ] Photos can be uploaded and stored
- [ ] Notification system triggers on job completion

### Package 4: API Integrations
- [ ] Pool chemistry API can retrieve data
- [ ] Weather API can retrieve data
- [ ] Chemistry alerts display on customer page
- [ ] Route adjustment logic works
- [ ] API errors are handled gracefully
- [ ] Environment variables for API keys are set

---

## Post-Implementation Tasks

### Deployment to Production
- Test with production database
- Verify environment variables for production
- Run full end-to-end tests
- Deploy to Vercel (`npm run build && vercel deploy`)

### Documentation
- Update README.md with new features
- Document API integrations
- Create user guide for real-time features

---

*Prepared for Claude Code execution by Brandon Bot*
*For Boss (Brandon Calloway) to hand off*

**Project:** PoolApp Route Optimization Software
**Location:** `/Users/brandonbot/projects/workbench/poolapp/`
**Status:** Ready for development
