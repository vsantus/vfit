import { WorkoutDetail } from "@/components/workouts/workout-detail";

type WorkoutDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutDetailPage({ params }: WorkoutDetailPageProps) {
  const { id } = await params;

  return <WorkoutDetail workoutId={id} />;
}
