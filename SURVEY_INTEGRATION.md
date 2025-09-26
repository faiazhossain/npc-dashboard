# Survey Details API Integration

## Overview

The survey details page now fetches data from the API endpoint `https://npsbd.xyz/api/survey/{id}` and displays comprehensive survey information with Redux user state integration.

## API Endpoint

```bash
curl -X 'GET' \
  'https://npsbd.xyz/api/survey/163' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

## Response Structure

The API returns detailed survey data including:

- `survey_id` - Survey identifier
- `user_id` - User who created the survey
- `person_details` - Personal information of respondent
- `location_details` - Geographic information
- `demand_details` - Survey responses about demands
- `worthful_party_name` - Preferred political party
- `avail_party_details` - Available party information
- `candidate_details` - Candidate information
- `selected_candidate_details` - Selected candidate details with ratings
- `candidate_work_details` - Information about candidate's work
- `approved_by` - Who approved the survey (if any)
- `status` - Current status (pending, approved, rejected)
- `created_at` / `updated_at` - Timestamps

## Features Implemented

### ✅ **API Integration**

- Fetches survey details using the provided curl endpoint
- Proper error handling and loading states
- Authentication using Bearer token from localStorage

### ✅ **Redux Integration**

- Console logs current user information when viewing surveys
- Shows relationship between logged user and survey creator
- Determines edit permissions based on user type and ownership

### ✅ **Comprehensive Data Display**

- **Personal Details** - Name, age, gender, religion, occupation
- **Location Information** - Division, district, thana, union, ward
- **Survey Responses** - Interactive display of multiple choice answers
- **Party Information** - Available parties and candidates
- **Candidate Evaluation** - Ratings and qualifications
- **Work History** - Candidate's contributions to society
- **Status Information** - Approval status and timestamps

### ✅ **Interactive Elements**

- Visual indicators for selected options (green checkmarks)
- Status badges with appropriate colors
- Responsive grid layouts for different screen sizes
- Smooth animations and transitions

### ✅ **User Permission Handling**

- Console logs show if user can edit survey
- Action buttons only show for pending surveys
- Permission checks based on user_type and survey ownership

## How to Use

### 1. **Navigate to Survey Details**

Click the eye icon (👁️) in the survey table to view details:

```javascript
// SurveyTable.js - Eye button click
onClick={() => router.push(`/dashboard/surveys/${item.id}`)}
```

### 2. **View Console Logs**

Open browser developer console to see:

- Complete survey data structure
- Current user information from Redux
- Permission calculations
- Survey and user ID relationships

### 3. **API Authentication**

The system automatically uses the stored access token:

```javascript
const token = localStorage.getItem('access_token');
headers: {
  'Authorization': `Bearer ${token}`,
}
```

## Console Output Example

When you view a survey, you'll see logs like:

```
=== Survey Details Loaded ===
Survey Data: {survey_id: 163, user_id: 4, person_details: {...}, ...}
Survey ID: 163
Survey User ID: 4
Current Logged User ID: 3
Current User Type: super_admin
Can user edit this survey? true
=== End Survey Info ===
```

## Permission Logic

```javascript
const canEdit =
  userData?.user_type === 'super_admin' || userData?.id === data.user_id;
```

- **Super Admin** - Can edit any survey
- **Regular User** - Can only edit their own surveys
- **Survey Owner** - Can edit surveys they created

## Status Display

- **অপেক্ষামান (Pending)** - Yellow badge, shows action buttons
- **অনুমোদিত (Approved)** - Green badge, no action buttons
- **বাতিল (Rejected)** - Red badge, no action buttons

## Data Visualization

- **Multiple Choice Questions** - Grid layout with checkmarks for selected options
- **Party/Candidate Info** - Organized by political party with candidate lists
- **Ratings/Qualifications** - Visual indicators for scored attributes
- **Location Hierarchy** - Division → District → Thana → Union → Ward

## Error Handling

- Network errors show user-friendly messages
- Missing token redirects or shows error
- Invalid survey IDs handled gracefully
- Loading states with proper Bangla text

## Next Steps

You can now:

1. Click any eye button in the survey table to view full details
2. See all survey information in organized, readable format
3. Check browser console for user permission and data logs
4. Verify that Redux user state persists across page refreshes
