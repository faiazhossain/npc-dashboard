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
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20; // API page_size

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
      console.log('API Response:', jsonData);

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
            : survey.status === 'approved'
            ? 'অনুমোদিত'
            : 'বাতিল',
      }));

      setSurveys(mappedSurveys);
      setTotalItems(total);
      setTotalPages(pages);

      console.log(`Loaded ${mappedSurveys.length} surveys for page ${page}`);
      console.log(`Total items: ${total}, Total pages: ${pages}`);
      console.log('Mapped surveys:', mappedSurveys);
      console.log(
        'Should show pagination:',
        pages > 1 || mappedSurveys.length === itemsPerPage
      );
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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelections = surveys
        .map((survey) => survey.id)
        .filter((id) => !selectedSurveys.includes(id));
      setSelectedSurveys([...selectedSurveys, ...newSelections]);
    } else {
      const currentPageIds = surveys.map((survey) => survey.id);
      setSelectedSurveys(
        selectedSurveys.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  const handleSelectSurvey = (id) => {
    setSelectedSurveys((prev) =>
      prev.includes(id)
        ? prev.filter((surveyId) => surveyId !== id)
        : [...prev, id]
    );
  };

  const handleApproveAll = async () => {
    try {
      const response = await fetch('/api/approve-surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ surveyIds: selectedSurveys }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve surveys');
      }

      // Update the data to reflect approved status
      setFilteredData((prev) =>
        prev.map((survey) =>
          selectedSurveys.includes(survey.id)
            ? { ...survey, status: 'অনুমোদিত' }
            : survey
        )
      );
      setSelectedSurveys([]); // Clear selection after approval
    } catch (error) {
      console.error('Error approving surveys:', error);
      setError('Failed to approve surveys');
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
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleApproveAll}
            className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            সব অনুমোদন করুন
          </motion.button>
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
