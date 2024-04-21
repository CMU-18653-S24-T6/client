import UserReviewHistory from "@/app/review/personalHistory/UserReviewHistory";

export default function UserReviewHistoryPage({ params }) {
  const { uid } = params;
  return <UserReviewHistory uid={uid}/>;
}