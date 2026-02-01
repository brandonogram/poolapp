# Pool Service Software Research Findings

**Research Date:** January 2026
**Purpose:** Deep research on what pool service company operators, managers, and field technicians actually need in their software

---

## Table of Contents
1. [Field Technician Needs (Mobile)](#1-field-technician-needs-mobile)
2. [Owner/Manager Dashboard Needs (Desktop)](#2-ownermanager-dashboard-needs-desktop)
3. [Common Pain Points](#3-common-pain-points)
4. [Feature Wishlist](#4-feature-wishlist)
5. [Quotes and Evidence](#5-quotes-and-evidence)
6. [Competitor Analysis](#6-competitor-analysis)
7. [Industry Trends & Statistics](#7-industry-trends--statistics)

---

## 1. Field Technician Needs (Mobile)

### What Techs Do at Each Stop

Pool service technicians follow a structured workflow at each service stop with three distinct phases:

**When Arriving:**
- Check gate codes and access instructions
- Review customer notes and service history
- View equipment details and any special instructions
- See previous chemical readings and dosing history

**Job In Progress:**
- Test water chemistry (pH, chlorine, alkalinity, etc.)
- Add chemicals based on readings (with dosing calculations)
- Clean pool (skim, brush, vacuum)
- Check equipment (pump, filter, heater)
- Perform scheduled maintenance tasks (backwash, filter cleaning)
- Take before/after photos for documentation
- Log any issues or equipment problems found

**When Leaving:**
- Complete service checklist
- Record chemicals used and quantities
- Add notes about any issues
- Submit service report
- Move to next stop on optimized route

### Information Techs Need BEFORE Arriving

1. **Access Information**
   - Gate codes (community gates vs. yard gates)
   - Entry instructions
   - Pet warnings
   - Key locations

2. **Customer Context**
   - Service history
   - Previous issues
   - Customer preferences
   - Equipment inventory
   - Multiple bodies of water (pool, spa, etc.)

3. **Route Information**
   - Optimized route order
   - Turn-by-turn navigation
   - Estimated drive times
   - Full day overview

4. **Task Requirements**
   - Standard service checklist
   - Special tasks scheduled for this visit (e.g., quarterly filter clean)
   - Pending repairs or quotes to discuss

### What Techs Log at Each Stop

- Water chemistry readings (pH, chlorine, CYA, alkalinity, calcium, TDS)
- Chemicals added (type and quantity)
- LSI calculations
- Equipment readings (PSI, pump status)
- Photos (before/after, equipment issues)
- Notes on problems found
- Time in/out
- Service completion status

### What Frustrates Technicians About Current Apps

**Speed & Performance Issues:**
- Slow loading times between screens
- Lag when saving data
- App crashes, especially after updates
- Delays when syncing data

**Offline Functionality Problems:**
> "Field technicians often need to work in areas without Internet access, like remote places or underground. A technician may have a 5G connection at 9:00 AM and no signal by lunch."

- Many apps don't work offline
- Data loss when connection drops
- Sync issues when coming back online

**Complexity & Usability:**
- Too many taps to complete basic tasks
- Confusing navigation
- Features buried in menus
- Training time too long (should be 5-30 minutes max)

**Missing Features:**
- No integrated chemical calculator (have to use separate app)
- Can't upload videos during service stops
- Limited photo documentation options
- No weather integration

### What Would Make Their Day Easier

1. **One-Tap Access** to gate codes, customer notes, and chemical history
2. **Automatic Chemical Dosing Calculations** based on readings entered
3. **Offline Mode** that works seamlessly and syncs automatically
4. **Voice Notes** for hands-free documentation
5. **Quick Photo Capture** with automatic categorization
6. **Smart Checklists** that adapt based on visit frequency and equipment type
7. **Real-Time Route Updates** when schedule changes
8. **Weather Alerts** for rain delays and rescheduling

---

## 2. Owner/Manager Dashboard Needs (Desktop)

### Daily Decisions Owners Make

1. **Route Management**
   - Which technician goes where
   - How to handle call-outs and emergencies
   - Weather delay rescheduling
   - Route optimization for efficiency

2. **Financial Decisions**
   - Which invoices need follow-up
   - Cash flow monitoring
   - Chemical cost tracking
   - Profitability per customer/route

3. **Customer Issues**
   - Service complaints to address
   - Quote approvals needed
   - Equipment repair scheduling

4. **Staffing**
   - Coverage for sick techs
   - Workload balancing
   - Training needs

### Key Metrics That Actually Matter

**Financial KPIs:**
- Total Revenue (daily, weekly, monthly)
- Gross Profit Margin (target: maintain costs below 35% of expenses)
- Revenue per technician
- Revenue per pool
- Outstanding invoices / AR aging
- Chemical costs as % of revenue

**Operational KPIs:**
- Service Completion Time (benchmark: under 90 minutes per visit)
- Stops completed per day per tech
- Route efficiency (miles driven vs. stops)
- Return Visit Rate (callbacks indicate quality issues)
- Employee Utilization Rate

**Customer KPIs:**
- Customer Satisfaction Score (target: 95%+)
- Subscription/Renewal Rate
- Customer Churn Rate
- Response time on service requests

**Growth KPIs:**
- New customers acquired
- Customer Acquisition Cost (CAC)
- Referral rate
- Quote conversion rate

### Critical Alerts Owners Need

1. **Service Issues**
   - Missed stops
   - Skipped services
   - Late arrivals
   - Equipment failures reported

2. **Financial Alerts**
   - Past-due invoices
   - Failed payments
   - Unprofitable customers
   - Chemical cost spikes

3. **Operational Alerts**
   - Technician no-shows
   - Route delays
   - Schedule conflicts
   - Weather impacts

4. **Quality Alerts**
   - Customer complaints
   - Negative feedback
   - Repeat service calls
   - Water chemistry issues (persistent problems)

### What Helps Owners Grow the Business

1. **Data-Driven Insights**
   - Identify unprofitable routes/customers
   - Track which services generate most revenue
   - Forecast seasonal demand
   - Marketing ROI tracking

2. **Operational Efficiency**
   - Route optimization savings
   - Chemical usage optimization
   - Labor cost tracking
   - Equipment lifecycle management

3. **Customer Retention Tools**
   - Automated communication
   - Service report transparency
   - Easy quote approval process
   - Self-service customer portal

4. **Growth Features**
   - Online booking for new customers
   - Review generation automation
   - Referral tracking
   - Marketing integration

---

## 3. Common Pain Points

### Pain Points by Software Category

#### Pool-Specific Software (Skimmer, Pool Brain, Pool Office Manager)

**Skimmer:**
- App crashes frequently, especially after updates
- Price increases (per-pool fee doubled from $1 to $2)
- Charges for text messages sent through app
- QuickBooks integration breaks periodically
- Can't send PDF invoices (important for commercial)
- No ability to upload videos during service
- Recurring work orders can't be auto-assigned

**Pool Brain:**
- Updates sometimes break core functionality
- Route map optimization issues after updates
- Difficulty seeing which pools are completed on map

**Pool Office Manager:**
- Mobile app is "super clunky"
- App constantly crashes and loses entered data
- Deletes pictures unexpectedly
- Signs users out frequently
- Limited customer support (chat only, no phone/email)
- Charges extra for QuickBooks integration

#### General Field Service Software (ServiceTitan, Jobber, Housecall Pro)

**ServiceTitan:**
- Extremely complex, overwhelming for small businesses
- Lengthy onboarding (some never get onboarded properly)
- High cost ($250-500/month per technician + add-ons)
- Hidden fees and unexpected charges
- No pool-specific features (chemical tracking, LSI, etc.)
- Poor customer support responsiveness

**Jobber:**
- Doesn't work offline (dealbreaker in poor coverage areas)
- QuickBooks integration is unreliable
- No pool-specific features
- Gets expensive as team grows
- Slow performance issues
- Clients on recurring plans can't leave tips

**Housecall Pro:**
- Zero pool-specific features
- Android app has 3.3/5 rating (poor)
- Cost creep from paid add-ons
- Declining support quality
- AI-only support on lower tiers
- Constant updates that "slow down performance"

### Universal Pain Points Across All Software

1. **Billing & Invoicing Issues**
   - QuickBooks sync problems
   - Limited invoice customization
   - No PDF invoice option
   - Stripe fee tracking confusion

2. **Mobile App Problems**
   - Crashes and data loss
   - Slow performance
   - Poor offline functionality
   - Clunky interfaces

3. **Customer Support**
   - Slow response times
   - Blame-shifting to users
   - Limited support channels
   - AI-only support on basic plans

4. **Pricing Concerns**
   - Frequent price increases
   - Features locked behind higher tiers
   - Per-user/per-pool pricing gets expensive
   - Hidden add-on costs

5. **Integration Issues**
   - QuickBooks sync breaks
   - Limited third-party integrations
   - Payment processor complications

6. **Feature Gaps**
   - No offline mode
   - Missing chemical calculators
   - Limited reporting
   - No video upload capability

### Size-Specific Pain Points

**Small Operators (1-2 techs):**
- Paying for features they don't need
- Software too complex for simple operations
- High monthly costs relative to revenue
- Some prefer pen and paper over complex software

**Growing Companies (3-10 techs):**
- Software that worked at small scale doesn't scale well
- Need better route optimization as routes expand
- Scheduling conflicts increase
- Communication gaps between office and field

**Large Operations (10+ techs):**
- Enterprise features missing
- Limited reporting and analytics
- Inventory management gaps
- Multi-location support issues

---

## 4. Feature Wishlist

### HIGH PRIORITY (Game-Changers)

#### 1. Bulletproof Offline Mode
**Impact:** Critical
**Why:** Technicians lose connectivity constantly in backyards, behind houses, in remote areas. Data loss destroys trust and wastes time.

**Requirements:**
- Full functionality without internet
- Automatic background sync when connected
- Conflict resolution for simultaneous edits
- Clear visual indicator of sync status

#### 2. Instant Chemical Dosing Calculator
**Impact:** Critical
**Why:** Most techs use separate apps for calculations. Integration saves 2-5 minutes per stop.

**Requirements:**
- LSI calculation built-in
- Dosing recommendations based on pool volume
- Chemical cost tracking per dose
- History of readings with trends

#### 3. One-Tap Service Completion
**Impact:** High
**Why:** Techs do 30-50 stops per day. Every tap saved = hours recovered.

**Requirements:**
- Single screen for all essential inputs
- Smart defaults based on history
- Quick photo capture
- Voice notes option

#### 4. Real-Time Route Optimization
**Impact:** High
**Why:** Can cut drive time by 25% and save 200+ miles per month.

**Requirements:**
- Automatic re-optimization when schedule changes
- Traffic-aware routing
- Weather delay integration
- Easy drag-and-drop rescheduling

#### 5. Photo/Video Documentation with Proof
**Impact:** High
**Why:** Eliminates disputes, builds trust, justifies billing.

**Requirements:**
- Before/after photo capture
- Timestamp and GPS verification
- Automatic inclusion in service reports
- Video upload for complex issues

### MEDIUM PRIORITY (Significant Value)

#### 6. Automated Customer Communication
- "On my way" texts
- Service completion notifications with photos
- Appointment reminders
- Easy skip/reschedule notifications

#### 7. Smart Scheduling with Conflict Prevention
- Double-booking prevention
- Weather-aware rescheduling
- Buffer time management
- Technician skill matching

#### 8. Equipment & Inventory Tracking
- Customer equipment profiles
- Maintenance history per equipment
- Low-stock alerts for chemicals
- Part reorder automation

#### 9. Seamless QuickBooks Integration
- Reliable two-way sync
- Automatic payment reconciliation
- Stripe fee tracking
- AR aging visibility

#### 10. Customer Self-Service Portal
- View service history
- Approve quotes online
- Pay invoices
- Update access information

### LOWER PRIORITY (Nice to Have)

#### 11. AI-Powered Features
- Predictive maintenance alerts
- Demand forecasting
- Automated scheduling suggestions
- Smart customer communication

#### 12. Multi-Property/Commercial Support
- HOA account management
- Multiple pools per property
- Commercial billing (PDF invoices)
- Property manager portal

#### 13. Weather Integration
- Rain delay automation
- Temperature-based chemical adjustments
- Storm preparation alerts
- Seasonal scheduling assistance

#### 14. Employee Management
- Time tracking
- Performance metrics
- Training modules
- Commission/bonus tracking

---

## 5. Quotes and Evidence

### From Review Sites (Capterra, G2, Software Advice)

**On App Stability:**
> "The app is buggy and for the first year of use, whenever we would complain about a software issue, Skimmer personnel would blame us - citing our internet connection, being out of date on updates, or that the software wasn't intended to be used with Chrome. They would never accept responsibility."

> "For the last 3 updates the app just crashes completely and randomly. I send diagnostic reports almost every time it happens. We have over 900 weekly cleans and pay a lot for this service."

**On Price Increases:**
> "Skimmer got greedy. They charge us for texting clients from the app when we get free texts on our phone. Then they told us the per pool monthly fee was going from $1 to $2 - a 100% increase."

**On Missing Features:**
> "Billing still has some kinks that need to be worked out, including the lack of ability to send PDF invoices which is important to commercial customers."

> "Unable to upload videos during service route stops or work orders to show specific issues of concern."

**On Complex Software:**
> "It's almost like it's too big to where my people are scared to dive in and learn so I end up only getting the bare features from it." (On ServiceTitan)

**On Support Issues:**
> "We had to pay them $18,000 for software we never used. We paid $750 a month for two years." (On ServiceTitan)

> "When we called, we couldn't talk to a human anymore for tech support. They would only relate through AI." (On Housecall Pro)

### From Industry Forums (Trouble Free Pool)

**On Software Adoption:**
> "Pen and paper may be preferable to automated software" - suggesting business software adoption isn't universal among professionals.

**On Cost Concerns:**
> "$35/month cost deemed excessive given free alternatives exist. Chemical calculators, route planners, and GPS tracking available separately at no cost."

**On Feature Bloat:**
> "Features better suited for large companies with multiple employees" - small operators feel they're paying for unnecessary complexity.

### From Industry Reports (State of Pool Service 2025)

**On Economic Challenges:**
> "Today's economic climate is the number one market challenge facing pool pros. Factors like inflation, interest rates, and consumer spending threaten all small businesses."

**On Technology Adoption:**
> "64% have adopted an all-in-one pool business management software. Only 5% use no management software - increasingly non-viable."

**On Growth Strategy:**
> "A record-high 60% of respondents reported that they'll be growing their business in 2025 by finding internal efficiencies and streamlining their services."

**On Hiring:**
> "Hiring, training, and retaining top talent is one of the biggest challenges pool service companies face—and one of the costliest. 35% of pool service company budgets are allocated to people-related expenses."

---

## 6. Competitor Analysis

### Tier 1: Pool-Specific Software

#### Skimmer
**Market Position:** #1 pool service software, trusted by 7,000+ companies
**Strengths:**
- Purpose-built for pool service
- Chemical tracking and LSI calculator
- Route optimization (saves up to 25% drive time)
- Good mobile app (works offline)
- Best-in-class customer support

**Weaknesses:**
- App stability issues after updates
- Price increases frustrating users
- Per-text messaging charges
- QuickBooks integration breaks
- Can't send PDF invoices

**Pricing:** ~$1-2 per pool per month

#### Pool Brain
**Market Position:** Growing competitor with strong automation
**Strengths:**
- Automatic chemical dosing calculations
- Strong workflow automation
- Good customer support responsiveness
- Detailed job history tracking
- Customer feedback tracking

**Weaknesses:**
- Updates break functionality
- Route map issues
- Less market penetration
- Fewer integrations

**Pricing:** Not publicly listed

#### Pool Office Manager
**Market Position:** Mid-market option
**Strengths:**
- Map-based scheduling (unique feature)
- Good for scaling companies
- Route optimization tools
- Quote management

**Weaknesses:**
- Mobile app is clunky
- Frequent crashes
- Data loss issues
- Chat-only support
- Extra charge for QuickBooks

**Pricing:** Starting at $70/month

### Tier 2: General Field Service Software

#### ServiceTitan
**Market Position:** Enterprise leader for home services
**Strengths:**
- Comprehensive feature set
- Strong reporting/analytics
- Good for large operations
- Marketing tools included

**Weaknesses:**
- No pool-specific features
- Very expensive ($250-500/tech/month)
- Complex implementation
- Overkill for small businesses
- Poor support responsiveness

**Best For:** Large pool companies (20+ techs) with full office staff

#### Jobber
**Market Position:** SMB-friendly field service
**Strengths:**
- Easy to use
- Good for beginners
- Decent mobile app
- Reasonable pricing

**Weaknesses:**
- No pool-specific features
- No offline mode
- QuickBooks sync issues
- Limited as you scale

**Best For:** New pool businesses wanting simplicity

#### Housecall Pro
**Market Position:** Mainstream field service
**Strengths:**
- Large user base (45,000+ businesses)
- Good marketing features
- Easy onboarding

**Weaknesses:**
- Zero pool features
- Poor Android app
- Cost creep from add-ons
- Declining support quality

**Best For:** Multi-trade businesses (not recommended for pool-only)

### Market Gap Analysis

**What's Missing in the Market:**

1. **True Offline-First Architecture** - Most apps add offline as afterthought
2. **Modern, Fast Mobile Experience** - Apps feel slow and dated
3. **Integrated Chemical Intelligence** - Dosing + tracking + cost in one
4. **Transparent Pricing** - No hidden fees or per-feature charges
5. **Right-Sized Solutions** - Most are either too simple or too complex
6. **Video Documentation** - No good solution for this yet
7. **Weather-Intelligent Scheduling** - Automatic rain delay handling

---

## 7. Industry Trends & Statistics

### Market Size & Growth

- Global Pool Service Software Market: **$5.96 Billion (2023)**
- Projected Market Size: **$10.42 Billion by 2030**
- CAGR: **8.33% (2024-2030)**
- Pool service industry demand expected to grow **5% for residential services by 2025**

### Technology Adoption (2025)

- **64%** use all-in-one pool business management software
- **68%** use accounting software for billing
- **Only 5%** use no management software
- **55%** plan to hire more employees in 2025

### Business Structure

- **52%** of technicians are employees (vs. 32% contractors)
- **62%** operate with 0-1 full-time office staff
- **47%** have 2-6 crew members

### Pricing & Revenue

- **76%** plan to increase prices in 2025
- **81%** expect revenue growth in 2025
- **Only 2%** predict revenue decline
- **55%** bill monthly with chemicals included
- **20%** use "plus chems" (separate chemical billing)

### Growth Strategy

- **60%** focusing on internal efficiencies (record high)
- **43%** plan business diversification
- **40%** increasing marketing budgets
- **25%** reducing customer volume to boost per-pool profitability
- **14%** pursuing route acquisition (down from 31% in 2023)

### Top Challenges

1. **Economic climate** - inflation, interest rates, consumer spending
2. **Rising chemical/material costs**
3. **Workforce recruitment and retention**
4. **Price-based competition**
5. **Private equity consolidation concerns**

### AI & Automation Trends

- Jobber launched **Copilot AI** (October 2024) - business insights and marketing content
- ServiceTitan announced **Atlas** (September 2025) - AI assistant for reports, dispatch, marketing
- **Cognitive AI pool cleaners** emerging (Aiper at CES 2026)
- Growing adoption of **predictive maintenance** using IoT sensors

### Customer Communication Preferences

- **90%** of customers prefer SMS over phone calls
- Automated notifications reduce customer calls by **2-5 hours/week**
- Service reports with photos increase customer trust significantly

---

## Key Takeaways for Product Development

### For Mobile App (Technician-Facing)

1. **Speed is everything** - Sub-second response times, minimal taps
2. **Offline is not optional** - Must work seamlessly without connection
3. **Chemical calculator is core** - Not an add-on, built into workflow
4. **One-screen service completion** - All essentials visible at once
5. **Photo/video first** - Easy capture, automatic organization

### For Dashboard (Owner-Facing)

1. **Revenue visibility** - Daily, weekly, monthly at a glance
2. **Alert-driven** - Surface problems, don't make them dig
3. **Route efficiency** - Miles, time, stops per tech
4. **Customer health** - Churn risk, payment status, satisfaction
5. **Simplicity over features** - They have 0-1 office staff

### Pricing Strategy

1. **Transparent pricing** - No hidden fees, no per-feature charges
2. **Right-sized tiers** - Solo operator vs. growing company vs. enterprise
3. **Value-based** - Show ROI (time saved, efficiency gained)
4. **No punishment for growth** - Don't penalize success with per-user fees

### Differentiation Opportunities

1. **Offline-first architecture** - Truly reliable, not bolted on
2. **Lightning-fast mobile** - Modern React Native, optimized performance
3. **Intelligent chemical management** - AI-powered dosing recommendations
4. **Weather-aware scheduling** - Automatic rain delays
5. **Video documentation** - First-class support for video
6. **Exceptional support** - Real humans, fast response, no blame

---

## Sources

### Industry Reports & Analysis
- [State of Pool Service 2025 - Skimmer](https://www.getskimmer.com/blog/10-insights-on-the-state-of-pool-service-2025)
- [Pool Magazine - State of Pool Service Report](https://www.poolmagazine.com/features/skimmers-state-of-pool-service-2025-key-findings-and-trends/)
- [Pool Service Software Landscape Analysis - Pool Dial](https://www.pooldial.com/resources/articles/business/pool-service-software-landscape)

### Software Reviews
- [Capterra - Skimmer Reviews](https://www.capterra.com/p/177014/Skimmer/reviews/)
- [Software Advice - Skimmer Reviews](https://www.softwareadvice.com/field-service/skimmer-profile/reviews/)
- [Capterra - Pool Brain Reviews](https://www.capterra.com/p/194225/Pool-Brain/reviews/)
- [GetApp - Pool Office Manager](https://www.getapp.com/industries-software/a/pool-office-manager/)
- [ServiceTitan Reviews & Criticisms](https://www.getonecrew.com/post/servicetitan-reviews)
- [Jobber Reviews - G2](https://www.g2.com/products/jobber/reviews)
- [Housecall Pro Review for Pool Service - PoolDial](https://www.pooldial.com/resources/articles/software-reviews/housecall-pro-review)

### Feature & Workflow Research
- [Pool Brain Help Center - Workflow Settings](https://help.poolbrain.com/en/articles/4450270-workflow-settings-for-service-levels)
- [Pool Office Manager - Features](https://poolofficemanager.com/features)
- [Skimmer - Product Features](https://www.getskimmer.com/product/billing)
- [ProValet - Pool Service Apps Guide](https://www.provalet.io/knowledge-base/top-pool-service-apps-revolutionizing-pool-maintenance-in-2024)

### KPIs & Business Metrics
- [6 KPIs for Pool Care Business - The Pool Blog](https://thepoolblog.com/2023/10/23/6-key-performance-indicators-kpis-you-can-use-to-grow-your-weekly-pool-care-business/)
- [5 Essential Metrics for Pool Maintenance - Business Plan Kit](https://businessplankit.com/blogs/kpis/pool-maintenance)
- [Pool & Spa News - KPIs](https://www.poolspanews.com/business/retail-management/growing-your-business-with-key-performance-indicators_o)

### Industry Challenges
- [Pool Magazine - Hidden Pain Points](https://www.poolmagazine.com/news/six-hidden-pool-service-pain-points-and-how-software-can-help/)
- [AQUA Magazine - Hiring Challenges](https://www.aquamagazine.com/retail/article/15122042/5-hard-truths-of-hiring-for-pool-spa-businesses)
- [ProValet - Employee Retention](https://www.provalet.io/blog/employee-retention-pool-service-company)

### Forum Discussions
- [Trouble Free Pool - Software Reviews](https://www.troublefreepool.com/threads/software-to-manage-pool-service-business-reviews.109487/)
