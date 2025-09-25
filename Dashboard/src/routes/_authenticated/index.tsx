import { createFileRoute } from '@tanstack/react-router';
import Dashboard from '@/features/calendar';

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
});
