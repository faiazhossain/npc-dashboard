"use client";
import { motion } from "framer-motion";
import { MdRemoveRedEye, MdEdit } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function SurveyTable({
  data,
  currentPage,
  itemsPerPage,
  selectedSurveys,
  onSelectSurvey,
  isAllSelected,
  onSelectAll,
}) {
  const router = useRouter();
  const getStatusColor = (status) => {
    switch (status) {
      case "অনুমোদিত":
        return "bg-green-100 text-green-800";
      case "বাতিল":
        return "bg-red-100 text-red-800";
      case "অপেক্ষামান":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate if all items on the current page are selected (for header checkbox)
  const isAllSelectedOnPage =
    data.length > 0 && data.every((item) => selectedSurveys.includes(item.id));

  // Handle the header checkbox click, but also sync with the parent's "সব নির্বাচন করুন" checkbox
  const handleSelectAllOnPage = (e) => {
    // First, handle the page-specific selection logic
    const pageIds = data.map((item) => item.id);

    if (e.target.checked) {
      // Add all unselected page items to selection
      const newSelections = pageIds.filter(
        (id) => !selectedSurveys.includes(id)
      );
      onSelectSurvey(newSelections); // Batch toggle for addition

      // If all items are now selected after this operation, also update the parent "সব নির্বাচন করুন" checkbox
      if (onSelectAll && e.target.checked) {
        onSelectAll({ target: { checked: true } });
      }
    } else {
      // Remove all page items from selection
      onSelectSurvey(pageIds.map((id) => id)); // Batch toggle for removal

      // If we're deselecting items on this page, the "সব নির্বাচন করুন" checkbox should be unchecked
      if (onSelectAll) {
        onSelectAll({ target: { checked: false } });
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected || isAllSelectedOnPage}
                  onChange={handleSelectAllOnPage}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                তারিখ
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                এরিয়া
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                প্রশ্নের উত্তর-১
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                প্রশ্নের উত্তর-২
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                স্ট্যাটাস
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ fontFamily: "Tiro Bangla, serif" }}
              >
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <motion.tr
                key={item.id}
                className="hover:bg-gray-50 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSurveys.includes(item.id)}
                    onChange={() => onSelectSurvey(item.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {item.date}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  {item.area}
                </td>
                <td
                  className="px-6 py-4 text-sm text-gray-900"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  <div className="flex flex-wrap gap-1">
                    {item.answer1.map((answer, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {answer}
                      </span>
                    ))}
                  </div>
                </td>
                <td
                  className="px-6 py-4 text-sm text-gray-900"
                  style={{ fontFamily: "Tiro Bangla, serif" }}
                >
                  <div className="flex flex-wrap gap-1">
                    {item.answer2.map((answer, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {answer}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      item.status
                    )}`}
                    style={{ fontFamily: "Tiro Bangla, serif" }}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      onClick={() =>
                        window.open(
                          `/dashboard/surveys/${item.id}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="text-[#006747] hover:text-[#005536] transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="দেখুন"
                    >
                      <MdRemoveRedEye className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      onClick={() =>
                        window.open(
                          `/dashboard/surveys/${item.id}?edit=true`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="সংশোধন করুন"
                    >
                      <MdEdit className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
