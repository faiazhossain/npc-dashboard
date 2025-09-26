'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SurveyBreadcrumb from './SurveyBreadcrumb';
import SurveyFilters from './SurveyFilters';
import SurveyTable from './SurveyTable';
import Pagination from './Pagination';

export default function SurveyContent() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  console.log('🚀 ~ SurveyContent ~ selectedSurveys:', selectedSurveys);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 30; // API page_size

  const breadcrumbItems = [
    { label: 'ড্যাশবোর্ড', path: '/dashboard' },
    { label: 'সার্ভে তালিকা', path: '/dashboard/surveys' },
  ];

  // Function to fetch surveys from API with pagination
  const loadSurveys = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      console.log(
        `Loading surveys: Page ${page}, Items per page: ${itemsPerPage}`
      );

      const response = await fetch(
        `https://npsbd.xyz/api/surveys/?page=${page}&page_size=${itemsPerPage}`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Handle different response formats
      let surveysArray = [];
      let total = 0;
      let pages = 0;

      if (Array.isArray(jsonData)) {
        // If response is direct array - this means we got current page data
        surveysArray = jsonData;
        // For array response, we don't know the total, so estimate
        if (jsonData.length === itemsPerPage) {
          // If we got exactly itemsPerPage, there might be more pages
          total = page * itemsPerPage + 1; // At least one more item exists
          pages = page + 1; // At least one more page
        } else {
          // If we got less than itemsPerPage, this is likely the last page
          total = (page - 1) * itemsPerPage + jsonData.length;
          pages = page;
        }
      } else if (jsonData.data && Array.isArray(jsonData.data)) {
        // If response has data property with pagination info
        surveysArray = jsonData.data;
        total = jsonData.total || jsonData.count || surveysArray.length;
        pages = jsonData.total_pages || Math.ceil(total / itemsPerPage);
      } else {
        throw new Error('Invalid response format');
      }

      // Map API response to match SurveyTable structure
      const mappedSurveys = surveysArray.map((survey) => ({
        id: survey.survey_id,
        date: new Date(survey.created_at).toLocaleDateString('bn-BD'),
        area: survey.location_details?.আসন || 'N/A',
        answer1: Object.entries(
          survey.demand_details?.[
            'বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি কি?'
          ] || {}
        )
          .filter(([_, value]) => value === 1)
          .map(([key]) => key),
        answer2: Object.entries(
          survey.selected_candidate_details?.[
            'এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?'
          ] || {}
        )
          .filter(([_, value]) => value === 1)
          .map(([key]) => key),
        status:
          survey.status === 'pending'
            ? 'অপেক্ষামান'
            : survey.status === 'accepted'
            ? 'অনুমোদিত'
            : 'বাতিল',
      }));

      setSurveys(mappedSurveys);
      setTotalItems(total);
      setTotalPages(pages);
    } catch (error) {
      console.error('Error loading surveys:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys(currentPage);
  }, [currentPage]);

  const handleFilterChange = (key, value) => {
    setCurrentFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Note: For API-based filtering, you would need to implement server-side filtering
  // This is a placeholder for future implementation
  const handleSearch = () => {
    // TODO: Implement API-based filtering with query parameters
    console.log('Search with filters:', currentFilters);
    // Example: loadSurveys(1, currentFilters);
    setCurrentPage(1);
    setSelectedSurveys([]);
  };

  const handleReset = () => {
    setCurrentFilters({});
    setCurrentPage(1);
    setSelectedSurveys([]);
    loadSurveys(1); // Reload first page without filters
  };

  // Function to flatten an array (handles nested arrays)
  const flattenArray = (arr) => {
    return arr.reduce((flat, current) => {
      return flat.concat(
        Array.isArray(current) ? flattenArray(current) : current
      );
    }, []);
  };

  // Handle select all surveys on the current page
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Get survey IDs from the current page
      const newSelections = surveys.map((survey) => survey.id);
      // Merge with existing selections, ensuring no duplicates and flattening
      const updatedSelections = [
        ...new Set([...selectedSurveys, ...newSelections]),
      ];
      setSelectedSurveys(updatedSelections);
      console.log('After Select All (checked):', updatedSelections);
    } else {
      // Remove only the survey IDs from the current page
      const currentPageIds = surveys.map((survey) => survey.id);
      const updatedSelections = selectedSurveys.filter(
        (id) => !currentPageIds.includes(id)
      );
      setSelectedSurveys(updatedSelections);
      console.log('After Select All (unchecked):', updatedSelections);
    }
  };

  // Handle individual survey selection
  const handleSelectSurvey = (id) => {
    setSelectedSurveys((prev) => {
      const updatedSelections = prev.includes(id)
        ? prev.filter((surveyId) => surveyId !== id)
        : [...prev, id];
      console.log('After Select Survey:', updatedSelections);
      return updatedSelections;
    });
  };

  // Handle bulk approval of selected surveys
  const handleApproveAll = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      // Flatten selectedSurveys to ensure no nested arrays
      const flatSurveyIds = flattenArray(selectedSurveys);
      console.log('Sending approval request to API:', flatSurveyIds);

      const response = await fetch(
        'https://npsbd.xyz/api/surveys/bulk/approve',
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            survey_ids: flatSurveyIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to approve surveys: ${response.status}`);
      }

      // Update the surveys state to reflect approved status
      setSurveys((prev) =>
        prev.map((survey) =>
          flatSurveyIds.includes(survey.id)
            ? { ...survey, status: 'অনুমোদিত' }
            : survey
        )
      );
      setSelectedSurveys([]); // Clear selection after approval
      console.log('Surveys approved successfully, selection cleared');
    } catch (error) {
      console.error('Error approving surveys:', error);
      setError('সার্ভে অনুমোদন করতে ব্যর্থ: ' + error.message);
    }
  };

  // Handle bulk rejection of selected surveys
  const handleRejectAll = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No access token found. Please log in again.');
      }

      // Flatten selectedSurveys to ensure no nested arrays
      const flatSurveyIds = flattenArray(selectedSurveys);
      console.log('Sending rejection request to API:', flatSurveyIds);

      const response = await fetch(
        'https://npsbd.xyz/api/surveys/bulk/reject',
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            survey_ids: flatSurveyIds,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to reject surveys: ${response.status}`);
      }

      // Update the surveys state to reflect rejected status
      setSurveys((prev) =>
        prev.map((survey) =>
          flatSurveyIds.includes(survey.id)
            ? { ...survey, status: 'বাতিল' }
            : survey
        )
      );
      setSelectedSurveys([]); // Clear selection after rejection
      console.log('Surveys rejected successfully, selection cleared');
    } catch (error) {
      console.error('Error rejecting surveys:', error);
      setError('সার্ভে বাতিল করতে ব্যর্থ: ' + error.message);
    }
  };

  const isAllSelected =
    surveys.length > 0 &&
    surveys.every((survey) => selectedSurveys.includes(survey.id));

  // Handle page change with logging
  const handlePageChange = (newPage) => {
    console.log(`Changing from page ${currentPage} to page ${newPage}`);
    setCurrentPage(newPage);
    setSelectedSurveys([]); // Reset selections when changing pages
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-gray-600 bg-white p-8 rounded-xl shadow-sm'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          ডেটা লোড করা হচ্ছে...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div
          className='text-lg text-red-600'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          ডেটা লোড করতে সমস্যা হয়েছে: {error}
        </div>
      </div>
    );
  }

  if (!surveys && !loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg' style={{ fontFamily: 'Tiro Bangla, serif' }}>
          কোন ডেটা পাওয়া যায়নি
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      <SurveyBreadcrumb items={breadcrumbItems} />
      <SurveyFilters
        filters={{}} // TODO: Get from API or define statically
        filterOptions={{}} // TODO: Get from API or define statically
        currentFilters={currentFilters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <div className='flex items-center justify-between mb-4'>
        <label className='flex items-center gap-2'>
          <input
            type='checkbox'
            checked={isAllSelected}
            onChange={handleSelectAll}
            className='h-5 w-5'
          />
          <span style={{ fontFamily: 'Tiro Bangla, serif' }}>
            সব নির্বাচন করুন
          </span>
        </label>
        {selectedSurveys.length > 0 && (
          <div className='flex gap-3'>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleApproveAll}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
              সব অনুমোদন করুন ({selectedSurveys.length})
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={handleRejectAll}
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors duration-200 flex items-center gap-2'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
              সব বাতিল করুন ({selectedSurveys.length})
            </motion.button>
          </div>
        )}
      </div>
      <SurveyTable
        data={surveys}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        selectedSurveys={selectedSurveys}
        onSelectSurvey={handleSelectSurvey}
      />
      {/* Always show pagination if there are surveys, for debugging */}
      {surveys.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}

      {surveys.length === 0 && !loading && (
        <motion.div
          className='text-center py-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p
            className='text-gray-500 mb-4'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            কোন সার্ভে পাওয়া যায়নি
          </p>
        </motion.div>
      )}
    </div>
  );
}
