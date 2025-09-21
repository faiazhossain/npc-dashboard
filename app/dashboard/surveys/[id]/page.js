import SurveyDetails from "@/components/surveyTab/SurveyDetails";

export default function SurveyDetailsPage({ params }) {
  return <SurveyDetails surveyId={params.id} />;
}
