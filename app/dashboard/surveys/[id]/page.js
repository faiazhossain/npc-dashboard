'use client';
import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdEdit, MdClose, MdCheckCircle, MdCancel } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

export default function SurveyDetails({ params }) {
  const resolvedParams = use(params);
  const [survey, setSurvey] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userData } = useAuth();

  // Handle Approve button click
  const handleApprove = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        `https://npsbd.xyz/api/survey/${resolvedParams.id}/approve`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSurvey((prev) => ({ ...prev, status: 'approved' }));
        console.log('Survey approved successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to approve survey.');
      }
    } catch (err) {
      console.error('Error approving survey:', err);
      setError('An error occurred while approving the survey.');
    }
  };

  // Handle Reject button click
  const handleReject = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found. Please log in again.');
      return;
    }

    try {
      const response = await fetch(
        `https://npsbd.xyz/api/survey/${resolvedParams.id}/reject`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSurvey((prev) => ({ ...prev, status: 'rejected' }));
        console.log('Survey rejected successfully');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to reject survey.');
      }
    } catch (err) {
      console.error('Error rejecting survey:', err);
      setError('An error occurred while rejecting the survey.');
    }
  };

  useEffect(() => {
    const fetchSurveyDetails = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://npsbd.xyz/api/survey/${resolvedParams.id}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setSurvey(data);
          console.log('=== Survey Details Loaded ===');
          console.log('Survey Data:', data);
          console.log('Survey ID:', data.survey_id);
          console.log('Survey User ID:', data.user_id);
          console.log('Current Logged User ID:', userData?.id);
          console.log('Current User Type:', userData?.user_type);
          console.log(
            'Can user edit this survey?',
            userData?.user_type === 'super_admin' ||
              userData?.id === data.user_id
          );
          console.log('=== End Survey Info ===');
        } else {
          setError('Failed to fetch survey details.');
        }
      } catch (err) {
        console.error('Error fetching survey details:', err);
        setError('An error occurred while fetching survey details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyDetails();
  }, [resolvedParams.id, userData?.id, userData?.user_type]);

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-gray-600'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          ডেটা লোড করা হচ্ছে...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-[400px]'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-lg text-red-600 bg-red-50 p-4 rounded-lg'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {error}
        </motion.div>
      </div>
    );
  }

  if (!survey) return null;

  // Helper function to format status
  const getStatusInBangla = (status) => {
    switch (status) {
      case 'pending':
        return 'অপেক্ষামান';
      case 'approved':
        return 'অনুমোদিত';
      case 'rejected':
        return 'বাতিল';
      default:
        return status;
    }
  };

  // Helper function to render key-value pairs
  const renderKeyValuePairs = (obj, title) => {
    if (!obj || typeof obj !== 'object') return null;

    return (
      <div className='mb-8'>
        <h3
          className='text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {title}
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {Object.entries(obj).map(([key, value]) => (
            <div key={key} className='space-y-1'>
              <p
                className='text-gray-600 text-sm'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                {key}:
              </p>
              <p
                className='text-gray-900'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                {typeof value === 'object'
                  ? JSON.stringify(value, null, 2)
                  : value || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render demand details
  const renderDemandDetails = (demandDetails) => {
    if (!demandDetails || typeof demandDetails !== 'object') return null;

    return (
      <div className='mb-8'>
        <h3
          className='text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          চাহিদার বিবরণ
        </h3>
        {Object.entries(demandDetails).map(([question, answers]) => (
          <div key={question} className='mb-6'>
            <h4
              className='text-lg font-medium mb-3 text-gray-700'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              {question}
            </h4>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
              {Object.entries(answers).map(([option, value]) => (
                <div
                  key={option}
                  className={`p-3 rounded-lg border-2 ${
                    value === 1
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span
                      className='text-sm'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {option}
                    </span>
                    {value === 1 ? (
                      <MdCheckCircle className='w-5 h-5 text-green-600' />
                    ) : (
                      <div className='w-5 h-5 rounded-full border-2 border-gray-300'></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Helper function to render party details
  const renderPartyDetails = (partyDetails, title) => {
    if (!partyDetails?.দল || !Array.isArray(partyDetails.দল)) return null;

    return (
      <div className='mb-8'>
        <h3
          className='text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2'
          style={{ fontFamily: 'Tiro Bangla, serif' }}
        >
          {title}
        </h3>
        <div className='space-y-4'>
          {partyDetails.দল.map((party, index) => (
            <div key={index} className='bg-gray-50 p-4 rounded-lg'>
              {Object.entries(party).map(([partyName, candidates]) => (
                <div key={partyName}>
                  <h4
                    className='font-semibold text-gray-800 mb-2'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    {partyName}
                  </h4>
                  <div className='space-y-1'>
                    {Array.isArray(candidates) ? (
                      candidates.map((candidate, idx) => (
                        <p
                          key={idx}
                          className='text-gray-600 ml-4'
                          style={{ fontFamily: 'Tiro Bangla, serif' }}
                        >
                          • {candidate}
                        </p>
                      ))
                    ) : (
                      <p
                        className='text-gray-600 ml-4'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        • {candidates}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='container mx-auto p-6 relative'>
      {/* Top Card */}
      <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
        <div className='flex justify-between items-start'>
          <div>
            <div className='mb-2' style={{ fontFamily: 'Tiro Bangla, serif' }}>
              <p className='text-gray-600'>সার্ভে আইডি:</p>
              <p className='text-xl font-semibold'>#{survey.survey_id}</p>
            </div>
            <div className='mb-2' style={{ fontFamily: 'Tiro Bangla, serif' }}>
              <p className='text-gray-600'>ব্যবহারকারী আইডি:</p>
              <p className='text-lg font-medium'>#{survey.user_id}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                getStatusInBangla(survey.status) === 'অনুমোদিত'
                  ? 'bg-green-100 text-green-800'
                  : getStatusInBangla(survey.status) === 'বাতিল'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              {getStatusInBangla(survey.status)}
            </span>
            <p
              className='mt-2 text-gray-600'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              তৈরি: {new Date(survey.created_at).toLocaleDateString('bn-BD')}
            </p>
            <p
              className='mt-1 text-gray-600'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              আপডেট: {new Date(survey.updated_at).toLocaleDateString('bn-BD')}
            </p>
            {survey.location_details?.আসন && (
              <p className='mt-1' style={{ fontFamily: 'Tiro Bangla, serif' }}>
                <span className='text-gray-600'>আসন:</span>{' '}
                {survey.location_details.আসন}
              </p>
            )}
          </div>
          <div className='flex gap-3'>
            {(userData?.user_type === 'super_admin' ||
              userData?.id === survey.user_id) &&
              survey.status === 'pending' && (
                <>
                  <button
                    onClick={handleApprove}
                    className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    <MdCheckCircle className='w-4 h-4' />
                    অনুমোদন দিন
                  </button>
                  <button
                    onClick={handleReject}
                    className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2'
                    style={{ fontFamily: 'Tiro Bangla, serif' }}
                  >
                    <MdCancel className='w-4 h-4' />
                    বাতিল করুন
                  </button>
                </>
              )}
          </div>
        </div>
      </div>

      {/* Survey Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='space-y-6'
      >
        {/* Personal Details */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          {renderKeyValuePairs(survey.person_details, 'ব্যক্তিগত তথ্য')}
        </div>

        {/* Location Details */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          {renderKeyValuePairs(survey.location_details, 'অবস্থানের তথ্য')}
        </div>

        {/* Demand Details */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          {renderDemandDetails(survey.demand_details)}
        </div>

        {/* Worthful Party */}
        {survey.worthful_party_name && (
          <div className='bg-white rounded-xl shadow-sm p-8'>
            <h3
              className='text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              যোগ্য দল
            </h3>
            <p
              className='text-lg text-gray-700'
              style={{ fontFamily: 'Tiro Bangla, serif' }}
            >
              {survey.worthful_party_name}
            </p>
          </div>
        )}

        {/* Available Party Details */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          {renderPartyDetails(survey.avail_party_details, 'উপলব্ধ দলের তথ্য')}
        </div>

        {/* Candidate Details */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          {renderPartyDetails(survey.candidate_details, 'প্রার্থীর তথ্য')}
        </div>

        {/* Selected Candidate Details */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          <h3
            className='text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            নির্বাচিত প্রার্থীর বিবরণ
          </h3>
          {survey.selected_candidate_details && (
            <div className='space-y-6'>
              {Object.entries(survey.selected_candidate_details).map(
                ([key, value]) => (
                  <div key={key}>
                    <h4
                      className='font-semibold text-gray-700 mb-3'
                      style={{ fontFamily: 'Tiro Bangla, serif' }}
                    >
                      {key}
                    </h4>
                    {typeof value === 'object' && value !== null ? (
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                        {Object.entries(value).map(([option, val]) => (
                          <div
                            key={option}
                            className={`p-3 rounded-lg border-2 ${
                              val === 1
                                ? 'bg-green-50 border-green-300'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <span
                                className='text-sm'
                                style={{ fontFamily: 'Tiro Bangla, serif' }}
                              >
                                {option}
                              </span>
                              {val === 1 ? (
                                <MdCheckCircle className='w-5 h-5 text-green-600' />
                              ) : (
                                <div className='w-5 h-5 rounded-full border-2 border-gray-300'></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p
                        className='text-gray-700 bg-gray-50 p-3 rounded-lg'
                        style={{ fontFamily: 'Tiro Bangla, serif' }}
                      >
                        {value}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Candidate Work Details */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          {renderKeyValuePairs(
            survey.candidate_work_details,
            'প্রার্থীর কার্যক্রমের তথ্য'
          )}
        </div>

        {/* Approval Information */}
        <div className='bg-white rounded-xl shadow-sm p-8'>
          <h3
            className='text-xl font-semibold mb-4 text-gray-800 border-b border-gray-200 pb-2'
            style={{ fontFamily: 'Tiro Bangla, serif' }}
          >
            অনুমোদনের তথ্য
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <p
                className='text-gray-600 text-sm'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                অনুমোদনকারী:
              </p>
              <p
                className='text-gray-900'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                {survey.approved_by || 'এখনো অনুমোদিত হয়নি'}
              </p>
            </div>
            <div className='space-y-1'>
              <p
                className='text-gray-600 text-sm'
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                স্ট্যাটাস:
              </p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm ${
                  getStatusInBangla(survey.status) === 'অনুমোদিত'
                    ? 'bg-green-100 text-green-800'
                    : getStatusInBangla(survey.status) === 'বাতিল'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
                style={{ fontFamily: 'Tiro Bangla, serif' }}
              >
                {getStatusInBangla(survey.status)}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
