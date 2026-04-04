import { WorkoutEditScreen } from "@/components/workouts/workout-edit-screen";

type EditWorkoutPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { id } = await params;

  return <WorkoutEditScreen workoutId={id} />;
}
