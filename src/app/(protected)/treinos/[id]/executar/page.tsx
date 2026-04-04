import { WorkoutExecution } from "@/components/workouts/workout-execution";

type WorkoutExecutionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WorkoutExecutionPage({ params }: WorkoutExecutionPageProps) {
  const { id } = await params;

  return <WorkoutExecution workoutId={id} />;
}
