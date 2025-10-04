# Survey Filtering System Implementation

## Overview

The survey table now includes a comprehensive filtering system similar to the General Questions page, with both API-based dynamic options and static filter choices.

## Filter Options

### **1. বিভাগ (Division)**

- **Source**: API endpoint `https://npsbd.xyz/api/divisions`
- **Dynamic**: Fetched on component mount
- **Display**: Shows `bn_name` (Bangla names)
- **Example**: ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, বরিশাল, সিলেট, রংপুর, ময়মনসিংহ

### **2. আসন (Constituency)**

- **Source**: API endpoint `https://npsbd.xyz/api/seats`
- **Dynamic**: Fetched on component mount
- **Display**: Shows `bn_name` (Bangla names)
- **Example**: ঢাকা-১, ঢাকা-২, চট্টগ্রাম-১, ইত্যাদি

### **3. স্ট্যাটাস (Status)**

- **Source**: Static options
- **Options**:
  - অপেক্ষামান (Pending)
  - অনুমোদিত (Approved)
  - বাতিল (Rejected)

### **4. প্রশ্ন ১ (Question 1) - Main Demands**

- **Source**: Static options based on survey demand details
- **Options**:
  - নিরাপত্তা (Security)
  - কর্মসংস্থান (Employment)
  - উন্নত যোগাযোগ (Better Communication)
  - পরিবেশ দূষণ রোধ (Environmental Protection)
  - দারিদ্র্যমুক্তি (Poverty Alleviation)
  - উন্নত স্বাস্থ্যসেবা (Better Healthcare)
  - উন্নত শিক্ষাব্যবস্থা (Better Education)
  - দ্রব্যমূল্য নিয়ন্ত্রণ (Price Control)

### **5. প্রশ্ন ২ (Question 2) - Candidate Qualities**

- **Source**: Static options based on candidate evaluation criteria
- **Options**:
  - সততা (Honesty)
  - মানবিক (Humanitarian)
  - রুচিশীল (Tasteful)
  - আদর্শবান (Idealistic)
  - জনপ্রিয় (Popular)
  - দেশপ্রেম (Patriotic)
  - সত্যবাদী (Truthful)
  - দূরদর্শিতা (Visionary)
  - উচ্চশিক্ষিত (Highly Educated)

## Implementation Features

### **✅ API Integration**

```javascript
// Fetch divisions
GET https://npsbd.xyz/api/divisions
Response: [{id: 1, name: "Dhaka", bn_name: "ঢাকা"}, ...]

// Fetch constituencies
GET https://npsbd.xyz/api/seats
Response: [{id: 1, name: "Dhaka-1", bn_name: "ঢাকা-১"}, ...]
```

### **✅ Server-Side Filtering**

```javascript
// API call with filters
GET https://npsbd.xyz/api/surveys/?page=1&page_size=30&division=ঢাকা&status=অপেক্ষামান

// Query parameters are dynamically built based on selected filters
const queryParams = new URLSearchParams({
  page: '1',
  page_size: '30',
  division: 'ঢাকা',
  status: 'অপেক্ষামান'
});
```

### **✅ Dynamic Filter Loading**

- Divisions and constituencies are fetched on component mount
- Static options are predefined based on survey data structure
- Filters are applied in real-time when user clicks "খুঁজুন" (Search)

### **✅ Filter State Management**

```javascript
const [currentFilters, setCurrentFilters] = useState({});
const [divisions, setDivisions] = useState([]);
const [constituencies, setConstituencies] = useState([]);

// Static options
const statusOptions = ['অপেক্ষামান', 'অনুমোদিত', 'বাতিল'];
const question1Options = ['নিরাপত্তা', 'কর্মসংস্থান', ...];
const question2Options = ['সততা', 'মানবিক', ...];
```

## User Experience

### **Filter Workflow:**

1. **Page Load** - API fetches divisions and constituencies
2. **Select Filters** - User chooses from dropdown options
3. **Apply Filters** - Click "খুঁজুন" button to search
4. **View Results** - Filtered surveys load with pagination
5. **Reset Filters** - Click "রিসেট করুন" to clear all filters

### **UI Components:**

- **Grid Layout** - 5 columns responsive grid for filter dropdowns
- **Bangla Labels** - All filter labels in Bangla
- **Action Buttons** - Search and Reset buttons with hover effects
- **Smooth Animations** - Framer Motion animations for interactions

## Technical Implementation

### **Filter Integration:**

```javascript
// SurveyFilters component receives:
filters={{
  division: 'বিভাগ',
  constituency: 'আসন',
  status: 'স্ট্যাটাস',
  question1: 'প্রশ্ন ১',
  question2: 'প্রশ্ন ২',
}}

filterOptions={{
  divisionOptions: divisions.map(div => div.bn_name),
  constituencyOptions: constituencies.map(constituency => constituency.bn_name),
  statusOptions: statusOptions,
  question1Options: question1Options,
  question2Options: question2Options,
}}
```

### **Search Implementation:**

```javascript
const handleSearch = () => {
  setCurrentPage(1);
  setSelectedSurveys([]);
  loadSurveys(1, currentFilters); // Apply filters to API call
};
```

### **Reset Implementation:**

```javascript
const handleReset = () => {
  setCurrentFilters({});
  setCurrentPage(1);
  setSelectedSurveys([]);
  loadSurveys(1, {}); // Reload without filters
};
```

## Benefits

1. **Enhanced User Experience** - Easy filtering by multiple criteria
2. **Performance** - Server-side filtering reduces data transfer
3. **Scalability** - Can handle large datasets efficiently
4. **Real-time** - Dynamic filter options from live API data
5. **Consistency** - Same UX pattern as General Questions page

## Console Output Example

```javascript
Loading surveys: Page 1, Items per page: 30 Filters: {division: 'ঢাকা', status: 'অপেক্ষামান'}
Applying filters: {division: 'ঢাকা', status: 'অপেক্ষামান'}
API Response: [...filtered surveys...]
```

The filtering system is now fully functional and provides comprehensive search capabilities for the survey data!
