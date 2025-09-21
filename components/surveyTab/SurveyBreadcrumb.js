"use client";
import { useRouter } from "next/navigation";

export default function SurveyBreadcrumb({ items }) {
  const router = useRouter();

  return (
    <nav className='mb-4'>
      <ol
        className='flex items-center space-x-2'
        style={{ fontFamily: "Tiro Bangla, serif" }}
      >
        {items.map((item, index) => (
          <li key={index} className='flex items-center'>
            {index > 0 && <span className='mx-2 text-gray-400'>/</span>}
            <button
              className={`${
                item.path
                  ? "text-[#006747] hover:text-[#005536]"
                  : "text-gray-500"
              } text-sm transition-colors duration-200`}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
