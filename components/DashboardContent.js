'use client';
import { motion } from 'framer-motion';
import {
  MdTrendingUp,
  MdPeople,
  MdAssessment,
  MdNotifications,
} from 'react-icons/md';

export default function DashboardContent() {
  const stats = [
    {
      title: 'মোট সার্ভে',
      value: '২৪',
      icon: MdAssessment,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'সক্রিয় ব্যবহারকারী',
      value: '১,২৫৪',
      icon: MdPeople,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'সম্পূর্ণ জরিপ',
      value: '১৮',
      icon: MdTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'নতুন বিজ্ঞপ্তি',
      value: '৭',
      icon: MdNotifications,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  const recentActivities = [
    {
      title: 'নতুন জরিপ তৈরি হয়েছে',
      description: 'গ্রাহক সন্তুষ্টি জরিপ ২০২৫',
      time: '২ ঘন্টা আগে',
      type: 'success',
    },
    {
      title: 'জরিপ সম্পন্ন হয়েছে',
      description: 'কর্মচারী মতামত জরিপ',
      time: '৫ ঘন্টা আগে',
      type: 'info',
    },
    {
      title: 'নতুন ব্যবহারকারী নিবন্ধিত',
      description: '১৫ জন নতুন ব্যবহারকারী যোগ দিয়েছেন',
      time: '১ দিন আগে',
      type: 'warning',
    },
  ];

  return <div></div>;
}
