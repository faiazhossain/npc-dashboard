# API-Based Pagination Implementation

## Overview

The survey table now implements proper server-side pagination using the API endpoint with page and page_size parameters.

## API Endpoint Format

```bash
GET https://npsbd.xyz/api/surveys/?page={page}&page_size={itemsPerPage}
```

## How It Works

### 1. **Pagination Parameters**

- `page` - Current page number (starts from 1, not 0)
- `page_size` - Number of items per page (set to 5)

### 2. **Page Navigation Flow**

```
Page 1: GET /api/surveys/?page=1&page_size=5  (Shows items 1-5)
Page 2: GET /api/surveys/?page=2&page_size=5  (Shows items 6-10)
Page 3: GET /api/surveys/?page=3&page_size=5  (Shows items 11-15)
...and so on
```

### 3. **Key Features Implemented**

#### ✅ **Server-Side Pagination**

- Each page change triggers a new API call
- No client-side data slicing
- Fresh data loaded for each page

#### ✅ **Dynamic Token Authentication**

- Uses `localStorage.getItem('access_token')`
- Proper Bearer token authentication
- Error handling for missing tokens

#### ✅ **Smart Response Handling**

- Supports different API response formats:
  - Direct array: `[{survey1}, {survey2}, ...]`
  - Wrapped object: `{data: [...], total: 100, total_pages: 20}`
- Calculates total pages automatically if not provided

#### ✅ **Enhanced Pagination Controls**

- **প্রথম (First)** - Jump to page 1
- **পূর্ববর্তী (Previous)** - Go to previous page
- **Page Numbers** - Smart pagination with dots (...)
- **পরবর্তী (Next)** - Go to next page
- **শেষ (Last)** - Jump to last page

#### ✅ **Console Logging**

- Logs page changes: "Changing from page X to page Y"
- Logs API responses for debugging
- Shows total items and pages loaded

### 4. **State Management**

```javascript
const [surveys, setSurveys] = useState([]); // Current page data
const [currentPage, setCurrentPage] = useState(1); // Current page number
const [totalItems, setTotalItems] = useState(0); // Total surveys count
const [totalPages, setTotalPages] = useState(0); // Total pages count
const [selectedSurveys, setSelectedSurveys] = useState([]); // Selected items
```

### 5. **Selection Handling**

- Selections reset when changing pages (prevents confusion)
- "Select All" only affects current page items
- Selection state preserved during same-page operations

### 6. **Error Handling**

- Network errors show user-friendly messages
- Missing authentication tokens handled gracefully
- Invalid response formats caught and logged

## Usage Example

### **User Interaction Flow:**

1. **Load Page 1** - API call: `page=1&page_size=5`

   - Shows surveys 1-5
   - Console: "Loading surveys: Page 1, Items per page: 5"

2. **Click "পরবর্তী" (Next)** - API call: `page=2&page_size=5`

   - Shows surveys 6-10
   - Console: "Changing from page 1 to page 2"

3. **Click Page Number 5** - API call: `page=5&page_size=5`
   - Shows surveys 21-25
   - Console: "Changing from page 2 to page 5"

### **Response Handling:**

```javascript
// API Response Format 1 (Direct Array)
[
  {survey_id: 1, created_at: "2025-09-26", ...},
  {survey_id: 2, created_at: "2025-09-26", ...},
  // ... 3 more surveys
]

// API Response Format 2 (Wrapped Object)
{
  "data": [...surveys...],
  "total": 147,
  "total_pages": 30,
  "current_page": 2
}
```

## Console Output Example

```
Loading surveys: Page 1, Items per page: 5
API Response: [{survey_id: 160, ...}, {survey_id: 161, ...}, ...]
Loaded 5 surveys for page 1
Total items: 5, Total pages: 1

Changing from page 1 to page 2
Loading surveys: Page 2, Items per page: 5
API Response: [{survey_id: 165, ...}, {survey_id: 166, ...}, ...]
Loaded 5 surveys for page 2
Total items: 5, Total pages: 1
```

## Benefits of This Implementation

1. **Performance** - Only loads 5 items at a time
2. **Scalability** - Can handle thousands of surveys
3. **Memory Efficient** - No large data arrays in browser
4. **Real-time** - Always shows latest data from server
5. **User-Friendly** - Clear pagination controls with Bangla labels

## Future Enhancements

### **Server-Side Filtering** (TODO)

```javascript
// Example: Add filter parameters to API call
const url = `https://npsbd.xyz/api/surveys/?page=${page}&page_size=${itemsPerPage}&status=pending&division=ঢাকা`;
```

### **Infinite Scroll** (Alternative)

```javascript
// Load more button instead of pagination
const loadMore = () => {
  setCurrentPage((prev) => prev + 1);
  // Append new data to existing surveys
};
```

The pagination system is now fully functional and will properly handle large datasets by fetching only the required page data from the server!
