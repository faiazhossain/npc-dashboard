'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SurveyBreadcrumb from './SurveyBreadcrumb';
import SurveyFilters from './SurveyFilters';
import SurveyTable from './SurveyTable';
import Pagination from './Pagination';

export default function SurveyContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [selectedSurveys, setSelectedSurveys] = useState([]);
  const [totalItems, setTotalItems] = useState(0); // Track total items for pagination
  const itemsPerPage = 5; // Matches API page_size

  const breadcrumbItems = [
    { label: 'ড্যাশবোর্ড', path: '/dashboard' },
    { label: 'সার্ভে তালিকা', path: '/dashboard/surveys' },
  ];

  // Function to fetch data from API
  const loadData = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://npsbd.xyz/api/surveys/?page=${page}&page_size=${itemsPerPage}`,
        {
          headers: {
            accept: 'application/json',
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdXBlcmFkbWluQGV4YW1wbGUuY29tIiwiZXhwIjoxNzYwMTc3OTk5fQ.K06AJwVEElP-dclCrnsgctEgklev9MqLGYhzjmviNyc',
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();

      // Map API response to match SurveyTable structure
      const mappedSurveys = jsonData.map((survey) => ({
        id: survey.survey_id,
        date: new Date(survey.created_at).toLocaleDateString('bn-BD'), // Format date
        area: survey.location_details?.আসন || 'N/A', // Use 'আসন' as area
        answer1: Object.entries(
          survey.demand_details?.[
            'বাংলাদেশের আগামীর নির্বাচিত সরকারের কাছে আপনার প্রধান চাওয়া কি কি?'
          ] || {}
        )
          .filter(([_, value]) => value === 1)
          .map(([key]) => key), // Extract selected demands
        answer2: Object.entries(
          survey.selected_candidate_details?.[
            'এই প্রার্থীর যোগ্যতার মাপকাঠি কি কি?'
          ] || {}
        )
          .filter(([_, value]) => value === 1)
          .map(([key]) => key), // Extract selected candidate qualities
        status:
          survey.status === 'pending'
            ? 'অপেক্ষামান'
            : survey.status === 'approved'
            ? 'অনুমোদিত'
            : 'বাতিল',
      }));

      setData({ surveys: mappedSurveys });
      setFilteredData(mappedSurveys);
      setTotalItems(jsonData.length); // Update with actual total from API if available
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const handleFilterChange = (key, value) => {
    setCurrentFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    if (!data) return;

    let filtered = data.surveys;

    // Apply filters
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => {
          if (key === 'question1') {
            return item.answer1.includes(value);
          }
          if (key === 'question2') {
            return item.answer2.includes(value);
          }
          return item[key] === value;
        });
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
    setSelectedSurveys([]); // Reset selection on filter change
  };

  const handleReset = () => {
    setCurrentFilters({});
    setFilteredData(data?.surveys || []);
    setCurrentPage(1);
    setSelectedSurveys([]); // Reset selection on reset
  };

  const handleSelectAll = (e) => {
    const currentPageData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    if (e.target.checked) {
      const newSelections = currentPageData
        .map((survey) => survey.id)
        .filter((id) => !selectedSurveys.includes(id));
      setSelectedSurveys([...selectedSurveys, ...newSelections]);
    } else {
      const currentPageIds = currentPageData.map((survey) => survey.id);
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
    filteredData.length > 0 &&
    filteredData
      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      .every((survey) => selectedSurveys.includes(survey.id));

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

  if (!data) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg' style={{ fontFamily: 'Tiro Bangla, serif' }}>
          কোন ডেটা পাওয়া যায়নি
        </div>
      </div>
    );
  }

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className='p-4 lg:p-8 min-h-screen'>
      <SurveyBreadcrumb items={breadcrumbItems} />
      <SurveyFilters
        filters={data.filters || {}} // Update based on API filter options
        filterOptions={data.filterOptions || {}} // Update based on API filter options
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
        data={currentData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        selectedSurveys={selectedSurveys}
        onSelectSurvey={handleSelectSurvey}
      />
      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems} // Use totalItems from API
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
      {filteredData.length === 0 && (
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
